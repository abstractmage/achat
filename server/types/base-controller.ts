import { Router } from 'express';


interface BaseController {
  router: Router;
  initRoutes(): void;
}


export default BaseController;
