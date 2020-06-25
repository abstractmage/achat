import { Router, Request, Response } from 'express';
import _ from 'lodash';

import BaseController from "../types/base-controller";
import isAuthorized from '../middlewares/is-authorized';
import handleErrors from '../utils/handle-errors';
import Mongoose from '../mongoose';
import validate, { required, string } from '../utils/validate';
import Chat from '../models/chat';
import ChatUser from '../models/chat-user';
import { UserDocument } from '../models/user';
import ValidationError from '../utils/errors/validation-error';
import Message from '../models/message';


interface CreateMessageBody {
  chatId: any;
  value: any;
}

interface CreateMessageData {
  chatId: any;
  userId: any;
  value: any;
}

class MessageController implements BaseController {
  router = Router();
  io!: SocketIO.Server;


  constructor() {
    this.initRoutes();
  }


  initRoutes() {
    this.router.post(['/messages', '/message'],
      isAuthorized,
      this.createMessage,
    );
  }


  setSocketServer = (io: SocketIO.Server) => {
    this.io = io;
  };


  private validateMessageData(data: CreateMessageData) {
    const isObjectId = (value: any) => {
      if (!Mongoose.Types.ObjectId.isValid(value)) return {
        success: false,
        value,
        message: `Field must be valid Object Id`,
      };

      return { success: true, value };
    };

    const isChatAvailable = async (chatId: string) => {
      const chat = await Chat.findById(chatId);

      if (!chat) return {
        success: false,
        value: chatId,
        message: 'Chat with this id not found',
      };

      return { success: true, value: chatId };
    };

    const isUserInChat = async (userId: string, { chatId }: CreateMessageData) => {
      if (!Mongoose.Types.ObjectId.isValid(chatId)) return {
        success: true,
        value: userId,
      };

      const chatUser = await ChatUser.findOne({
        user: Mongoose.Types.ObjectId(userId),
        chat: Mongoose.Types.ObjectId(chatId),
      });

      if (!chatUser) return {
        success: false,
        value: userId,
        message: 'This user is not in this chat',
      };

      return { success: true, value: userId };
    };

    return validate(data, {
      chatId: [required(), isObjectId, isChatAvailable],
      userId: [required(), isObjectId, isUserInChat],
      value: [required(), string()],
    }, true);
  }


  private createMessage = async (req: Request, res: Response) => {
    try {
      const { chatId, value } = req.body as CreateMessageBody;
      const user = res.locals.user as UserDocument;
      const validationResult = await this.validateMessageData({ chatId, value, userId: user.id });

      if (!validationResult.success) throw new ValidationError({
        message: 'Message Creation Failed: Invalid data',
        errors: _.fromPairs(
          _.toPairs(validationResult.fields)
            .map(pair => [pair[0], { value: pair[1].value, message: pair[1].message! }])
        ),
      });

      const message = await Message.create({
        chat: chatId,
        user: user.id,
        value,
      });

      res.status(201)
        .json({
          message,
          user,
        });
    } catch (err) {
      handleErrors(res, err);
    }
  };
}


export default MessageController;
