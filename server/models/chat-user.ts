import mongoosePaginate from 'mongoose-paginate-v2';

import Mongoose from './../mongoose';
import { UserDocument } from './user';
import { ChatDocument } from './chat';


export interface ChatUserDocument extends Mongoose.Document {
  user: Mongoose.Types.ObjectId | UserDocument;
  chat: Mongoose.Types.ObjectId | ChatDocument;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatUserModel<T extends Mongoose.Document> extends Mongoose.PaginateModel<T> {}

const chatUserSchema = new Mongoose.Schema({
  user: { type: Mongoose.Types.ObjectId, ref: 'User', index: true },
  chat: { type: Mongoose.Types.ObjectId, ref: 'Chat', index: true },
}, {
  timestamps: true,
  versionKey: false,
  collection: 'chat-users',
});

chatUserSchema.plugin(mongoosePaginate);

const ChatUser = Mongoose.model<ChatUserDocument, ChatUserModel<ChatUserDocument>>('ChatUser', chatUserSchema);

export default ChatUser;
