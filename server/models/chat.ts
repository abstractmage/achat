import aggregatePlugin from 'mongoose-aggregate-paginate-v2';
import Mongoose from './../mongoose';
import ChatUser from './chat-user';


export interface ChatDocument extends Mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  isChatUser: (userId: Mongoose.Types.ObjectId | string) => Promise<boolean>;
}

export interface ChatModel<T extends Mongoose.Document> extends Mongoose.PaginateModel<T> {
  aggregatePaginate: (aggregate: Mongoose.Aggregate<any[]>, options: Mongoose.PaginateOptions) => Promise<Mongoose.PaginateResult<any>>;
}

const chatSchema = new Mongoose.Schema({}, {
  timestamps: true,
  versionKey: false,
  collection: 'chats',
});

chatSchema.methods.isChatUser = async function (userId: Mongoose.Types.ObjectId | string) {
  const self = this as ChatDocument;
  const userObjId = typeof userId === 'string' ? Mongoose.Types.ObjectId(userId) : userId;
  const chatUser = await ChatUser.findOne({ user: userObjId, chat: self.id });

  return !!chatUser;
};

chatSchema.plugin(aggregatePlugin);

const Chat = Mongoose.model<ChatDocument, ChatModel<ChatDocument>>('Chat', chatSchema);

export default Chat;
