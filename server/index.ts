import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import App from './app';
import UserController from './controllers/user';
import AuthController from './controllers/auth';
import identification from './middlewares/identification';


const app = new App({
  middleWares: [
    cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:3001'] }),
    helmet(),
    bodyParser.json(),
    cookieParser(),
    identification,
  ],
  controllers: [
    new UserController,
    new AuthController,
  ],
});


app.listen();
