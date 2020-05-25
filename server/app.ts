import express, { Application } from 'express';

import config from './app.config.json';
import BaseController from './types/base-controller';
import MiddleWare from './types/middleware';


interface AppOptions {
  middleWares?: MiddleWare[];
  controllers?: BaseController[];
}

class App {
  public app: Application;
  public port: number;


  constructor(options: AppOptions = {}) {
    this.app = express();
    this.port = config.port;

    options.middleWares && this.middlewares(options.middleWares);
    options.controllers && this.routes(options.controllers);
  }


  private middlewares(middleWares: MiddleWare[]) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }


  private routes(controllers: BaseController[]) {
    controllers.forEach(controller => {
      this.app.use('/api', controller.router);
    });
  }


  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`)
    })
  }
}


export default App;
