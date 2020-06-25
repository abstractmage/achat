import User from "./user";
import Chat from "./chat";

interface Message {
  _id: string;
  user: string | User;
  chat: string | Chat;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export default Message;
