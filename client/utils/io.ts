import SocketIO from 'socket.io-client';
import { backendURL } from '~/app.config';

class IO {
  socket: SocketIOClient.Socket;
  private static uri = backendURL;
  private static instance: IO | null = null;

  constructor(options?: SocketIOClient.ConnectOpts) {
    this.socket = SocketIO.connect(IO.uri, options);
    this.socket.on('connect', () => console.log(this.socket.id));
  }

  joinChat(chatId: string) {
    this.socket.emit('client:join-chat', chatId);
  }

  leaveChat(chatId: string) {
    this.socket.emit('client:leave-chat', chatId);
  }

  static disconnect() {
    IO.instance && IO.instance.socket.disconnect();
  }

  static getInstance() {
    if (IO.instance) return IO.instance;

    IO.instance = new IO();

    return IO.instance;
  }
}

export default IO;
