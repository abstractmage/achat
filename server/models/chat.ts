import Mongoose from './../mongoose';


export interface ChatDocument extends Mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatModel<T extends Mongoose.Document> extends Mongoose.Model<T> {}

const schema = new Mongoose.Schema({}, {
  timestamps: true,
  versionKey: false,
  collection: 'chats',
});

const Chat = Mongoose.model<ChatDocument, ChatModel<ChatDocument>>('Chat', schema);


export default Chat;
