import express, { Application } from 'express';
import SocketIO from 'socket.io';
import Cookie from 'cookie';

import config from './app.config.json';
import BaseController from './types/base-controller';
import MiddleWare from './types/middleware';
import getUserByToken from './utils/get-user-by-token';
import UnauthorizedError from './utils/errors/unauthorized-error';


interface AppOptions {
  middleWares?: MiddleWare[];
  controllers?: BaseController[];
}

class App {
  public express: Application;
  public port: number;
  public io!: SocketIO.Server;
  public controllers!: BaseController[];


  constructor(options: AppOptions = {}) {
    this.express = express();
    this.port = config.port;

    options.middleWares && this.initMiddlewares(options.middleWares);
    options.controllers && this.initControllers(options.controllers);
  }


  private initMiddlewares(middleWares: MiddleWare[]) {
    middleWares.forEach(middleWare => {
      this.express.use(middleWare);
    });
  }


  private initControllers(controllers: BaseController[]) {
    this.controllers = controllers;

    controllers.forEach(controller => {
      this.express.use('/api', controller.router);
    });
  }


  public listen() {
    const server = this.express.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`)
    });

    this.io = SocketIO(server);

    this.io.use(async (socket, next) => {
      const { 'access-token': accessTokenVal } = Cookie.parse(socket.handshake.headers['cookie'] || '');
      const user = await getUserByToken(accessTokenVal);

      if (!user) {
        next(new UnauthorizedError({
          message: 'Web Socket Connection Failed: Unauthorized',
        }));
        return;
      }

      // socket.in(`user-${user._id}`);

      next();
    });

    this.controllers.forEach(controller => {
      controller.setSocketServer && controller.setSocketServer(this.io);
    });

    return server;
  }
}


export default App;
