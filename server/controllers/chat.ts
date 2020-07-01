import { Router, Request, Response } from 'express';
import { intersectionWith, isFinite } from 'lodash';

import BaseController from "../types/base-controller";
import isAuthorized from '../middlewares/is-authorized';
import handleErrors from '../utils/handle-errors';
import ChatUser from '../models/chat-user';
import User, { UserDocument } from '../models/user';
import Mongoose from '../mongoose';
import ValidationError from '../utils/errors/validation-error';
import Chat, { ChatDocument } from '../models/chat';
import NotFoundError from '../utils/errors/not-found-error';
import BadRequestError from '../utils/errors/bad-request-error';
import Message from '../models/message';
import ForbiddenError from '../utils/errors/forbidden-error';


interface CreateChatBody {
  userId: any;
}

interface GetChatsQuery {
  query: any;
  pagination: any;
}

class ChatController implements BaseController {
  router = Router();


  constructor() {
    this.initRoutes();
  }


  initRoutes() {
    this.router.post(['/chats', '/chat'],
      isAuthorized,
      this.createChat,
    );
    this.router.get(['/chats/:id', '/chat/:id'],
      isAuthorized,
      this.getChat,
    );
    this.router.get(['/chats', '/chat'],
      isAuthorized,
      this.getChats,
    );
  }


  private validateCreationData = async (authUser: UserDocument, userId: any) => {
    if (!userId || typeof userId !== 'string') return 'invalid';

    userId = Mongoose.Types.ObjectId(userId);

    if (authUser.id.toString() === userId.toString()) return 'invalid';

    const [authChatUsers, chatUsers] = await Promise.all([
      ChatUser.find({ user: authUser.id }),
      ChatUser.find({ user: userId }),
    ]);

    const intersection = intersectionWith(
      authChatUsers,
      chatUsers,
      (prev, next) => prev.chat.toString() === next.chat.toString()
    );

    if (intersection.length) return intersection[0].chat as Mongoose.Types.ObjectId;

    return 'valid';
  };


  private createChat = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body as CreateChatBody;
      const authUser = res.locals.user as UserDocument;
      const validationResult = await this.validateCreationData(authUser, userId);

      if (validationResult === 'invalid') throw new ValidationError({
        message: 'Chat Creation Failed: Invalid format parameter',
        errors: {
          userId: {
            value: userId,
            message: 'Invalid format parameter',
          },
        },
      });
      else if (validationResult !== 'valid') {
        const chat = await Chat.findById(validationResult);
        const [authChatUser, chatUser] = await Promise.all([
          ChatUser.findOne({ user: authUser.id, chat: chat!.id }),
          ChatUser.findOne({ user: Mongoose.Types.ObjectId(userId), chat: chat!.id }),
        ]);

        res.status(200)
          .json({
            chat,
            authChatUser,
            chatUser,
          });

        return;
      }

      const chat = await Chat.create({});

      const [authChatUser, chatUser] = await ChatUser.create([{
        user: authUser.id,
        chat: chat.id,
      }, {
        user: Mongoose.Types.ObjectId(userId),
        chat: chat.id,
      }]);

      res.status(201)
        .json({
          chat,
          authChatUser,
          chatUser,
        });
    } catch (err) {
      handleErrors(res, err);
    }
  };


  private getChat = async (req: Request, res: Response) => {
    try {
      const { id = null } = req.params;
      const lastMessages = +(req.query.lastMessages || 10);
      const user: UserDocument = res.locals.user;

      if (!id || !Mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError({
        message: 'Chat Getting Failed: Invalid id',
      });

      if (!isFinite(lastMessages)) throw new BadRequestError({
        message: 'Chat Getting Failed: Invalid params',
      });

      const chat = await Chat.findById(id);

      if (!chat) throw new NotFoundError({
        message: 'Chat Getting Failed: Invalid id',
      });

      if (!(await chat.isChatUser(user.id))) throw new ForbiddenError({
        message: 'Chat Getting Failed: Forbidden',
      });

      const [chatUsers, messages] = await Promise.all([
        ChatUser.find({ chat: chat.id }),
        Message.paginate({ chat: chat.id }, { sort: { createdAt: -1 }, limit: lastMessages }),
      ]);

      const users = await User.paginate({
        _id: { $in: chatUsers.map(u => u.user) },
      }, { limit: 2 });

      res.status(200)
        .json({
          ...chat.toJSON(),
          users,
          messages,
        });
    } catch (err) {
      handleErrors(res, err);
    }
  };


  private getChats = async (req: Request, res: Response) => {
    const reqQuery = req.query as any as GetChatsQuery;
    const pagination = reqQuery.pagination;
    const query = typeof reqQuery.query === 'string' ? reqQuery.query : '';
    const user = res.locals.user as UserDocument;
    const aggregate = Chat.aggregate([
      {
        $lookup: {
          from: 'chat-users',
          as: 'users',
          let: { chatId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$chat', '$$chatId'] }] } } },
            { $group: { _id: '$user' } },
          ],
        },
      },
      {
        $match: {
          $expr: { $in: [user._id, '$users._id'] },
        },
      },
      {
        $project: {
          createdAt: 1,
          updatedAt: 1,
          users: {
            $map: {
              input: '$users',
              as: 'user',
              in: '$$user._id',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'users',
          localField: 'users',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          companion: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$users',
                  as: 'user',
                  cond: { $not: { $eq: [user._id, '$$user._id'] } },
                },
              },
              0
            ]
          },
        },
      },
      {
        $match: {
          $expr: {
            $or: [
              {
                $regexMatch: {
                  input: '$companion.nickname',
                  regex: query,
                  options: 'i',
                },
              },
              {
                $regexMatch: {
                  input: '$companion.email',
                  regex: query,
                  options: 'i',
                },
              },
            ],
          },  
        },
      },
      {
        $lookup: {
          from: 'messages',
          as: 'message',
          let: { chat: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$chat', '$$chat'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
        },
      },
      {
        $addFields: {
          message: {
            $ifNull: [{ $arrayElemAt: ['$message', 0] }, null],
          },
        },
      },
      {
        $project: {
          createdAt: 1,
          updatedAt: 1,
          'companion._id': 1,
          'companion.nickname': 1,
          'companion.email': 1,
          'companion.createdAt': 1,
          'companion.updatedAt': 1,
          message: 1,
        },
      },
    ]);

    const chats = await Chat.aggregatePaginate(aggregate, { ...pagination, sort: { message: { createdAt: -1 } } });

    res.status(200)
      .json(chats);
  };
}


export default ChatController;
