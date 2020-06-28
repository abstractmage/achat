import { Server } from "http";
import SocketIO from 'socket.io';
import Cookie from 'cookie';
import UnauthorizedError from './../utils/errors/unauthorized-error';
import User, { UserDocument } from "../models/user";
import Chat from "../models/chat";

const validateJoinChat = async (chatId: string, user: UserDocument) => {
  const chat = await Chat.findById(chatId);

  if (!chat) return false;

  if (!(await chat.isChatUser(user.id))) return false;

  return true;
};

const createSocket = (server: Server) => {
  const io = SocketIO(server);

  io.use(async (socket, next) => {
    const { 'access-token': accessTokenVal } = Cookie.parse(socket.handshake.headers['cookie'] || '');
    const user = await User.findByToken(accessTokenVal);

    if (!user) {
      next(new UnauthorizedError({
        message: 'Web Socket Connection Failed: Unauthorized',
      }));
      return;
    }

    next();
  });

  io.on('connect', async socket => {
    console.log('Socket Connected ---', socket.id);
    socket.on('disconnect', () => console.log('Socket Disconnected ---', socket.client.id));
    
    const { 'access-token': accessTokenVal } = Cookie.parse(socket.handshake.headers['cookie'] || '');
    const user = (await User.findByToken(accessTokenVal))!;

    socket.on('client:join-chat', async chatId => {
      if (!(await validateJoinChat(chatId, user))) return;

      console.log('Joined to chat');
      socket.join(`chat[${chatId}]`);
    });

    socket.on('client:leave-chat', async chatId => {
      if (!(await validateJoinChat(chatId, user))) return;

      console.log('Leaved from chat');
      socket.leave(`chat[${chatId}]`);
    });
  });

  return io;
};

export default createSocket;
