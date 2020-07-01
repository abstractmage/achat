import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import App from './app';
import UserController from './controllers/user';
import AuthController from './controllers/auth';
import identification from './middlewares/identification';
import ChatController from './controllers/chat';
import MessageController from './controllers/message';
import config from './app.config';

const app = new App({
  middleWares: [
    cors({ credentials: true, origin: [config.backDomain, config.frontDomain] }),
    helmet(),
    bodyParser.json(),
    cookieParser(),
    identification,
  ],
  controllers: [
    new UserController,
    new AuthController,
    new ChatController,
    new MessageController,
  ],
});

app.listen();
