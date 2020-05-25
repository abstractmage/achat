import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import App from './app';
import UserController from './controllers/user';
import AuthController from './controllers/auth';


const app = new App({
  middleWares: [
    cors(),
    helmet(),
    bodyParser.json(),
    cookieParser(),
  ],
  controllers: [
    new UserController,
    new AuthController,
  ],
});


app.listen();
