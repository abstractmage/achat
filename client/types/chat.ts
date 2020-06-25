import Pagination from "./pagination";
import User from "./user";
import Message from "./message";

interface Chat {
  _id: string;
  users?: Pagination<User>;
  messages?: Pagination<Message>;
  createdAt: string;
  updatedAt: string;
}

export default Chat;
