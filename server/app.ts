import express, { Application } from 'express';
import SocketIO from 'socket.io';
import http, { Server } from 'http';
import config from './app.config';
import BaseController from './types/base-controller';
import MiddleWare from './types/middleware';
import createSocket from './utils/create-socket';

interface AppOptions {
  middleWares?: MiddleWare[];
  controllers?: BaseController[];
}

class App {
  public express: Application;
  public http: Server;
  public port: number;
  public io: SocketIO.Server;
  public controllers!: BaseController[];


  constructor(options: AppOptions = {}) {
    this.port = config.port;
    this.express = express();
    this.http = http.createServer(this.express);
    this.io = createSocket(this.http);

    options.middleWares && this.initMiddlewares(options.middleWares);
    options.controllers && this.initControllers(options.controllers);
  }


  private initMiddlewares(middleWares: MiddleWare[]) {
    middleWares.forEach(middleWare => {
      this.express.use(middleWare);
    });

    this.express.use((_, res, next) => {
      res.locals.io = this.io;
      next();
    });
  }


  private initControllers(controllers: BaseController[]) {
    this.controllers = controllers;

    controllers.forEach(controller => {
      this.express.use('/api', controller.router);
    });
  }


  public listen() {
    this.http.listen(this.port, () => {
      console.log(process.env.NODE_ENV);
      console.log(`App listening on the http://${config.host}:${this.port}`);
    });
  }
}

export default App;
