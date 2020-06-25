import { Router } from 'express';


interface BaseController {
  router: Router;
  initRoutes(): void;
  setSocketServer?: (socketServer: SocketIO.Server) => void;
}


export default BaseController;
