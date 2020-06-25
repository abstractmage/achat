import mongoosePaginate from 'mongoose-paginate-v2';

import Mongoose from './../mongoose';
import { UserDocument } from './user';
import { ChatDocument } from './chat';


export interface MessageDocument extends Mongoose.Document {
  user: Mongoose.Types.ObjectId | UserDocument;
  chat: Mongoose.Types.ObjectId | ChatDocument;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageModel<T extends Mongoose.Document> extends Mongoose.PaginateModel<T> {}

const messageSchema = new Mongoose.Schema({
  user: { type: Mongoose.Types.ObjectId, ref: 'User', index: true },
  chat: { type: Mongoose.Types.ObjectId, ref: 'Chat', index: true },
  value: String,
}, {
  versionKey: false,
  timestamps: true,
  collection: 'messages',
});

messageSchema.plugin(mongoosePaginate);

const Message = Mongoose.model<MessageDocument, MessageModel<MessageDocument>>('Message', messageSchema);


export default Message;
