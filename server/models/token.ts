import mongoose from './../mongoose';

import User from './user';
import { encode, decode } from './../utils/token-service';
import { auth } from './../app.config.json';


export interface TokenDocument extends mongoose.Document {
  type: 'access' | 'refresh';
  expiresOn: Date;
  value: string;
  userId: mongoose.Types.ObjectId;
  fingerprint: string;
  decode(): ReturnType<typeof decode>;
}

export interface TokenModel<T extends mongoose.Document> extends mongoose.Model<T> {
  createUserTokens(userId: mongoose.Types.ObjectId, fingerprint: string): Promise<[TokenDocument, TokenDocument]>;
  findByValue(value: string): Promise<TokenDocument | null>
}

const tokenSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['access', 'refresh'],
    required: true,
  },
  expiresOn: {
    type: Date,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fingerprint: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
  collection: 'tokens',
});

tokenSchema.statics.createUserTokens = async function (userId: mongoose.Types.ObjectId, fingerprint: string) {
  const self: TokenModel<TokenDocument> = this;
  const tokens = await self.find({ userId, fingerprint });
  await Promise.all(tokens.map(t => t.remove()));

  return self.create([{
    type: 'access',
    expiresOn: new Date(Date.now() + auth.options.access.expiresIn * 1000),
    value: encode(userId, 'access'),
    userId,
    fingerprint,
  }, {
    type: 'refresh',
    expiresOn: new Date(Date.now() + auth.options.refresh.expiresIn * 1000),
    value: encode(userId, 'refresh'),
    userId,
    fingerprint,
  }]);
};

tokenSchema.statics.findByValue = async function (value: string) {
  const self: TokenModel<TokenDocument> = this;

  return self.findOne({ value });
};

tokenSchema.methods.decode = function () {
  const self = this as TokenDocument;
  
  return decode(self.value);
}

const Token = mongoose.model<TokenDocument, TokenModel<TokenDocument>>('Token', tokenSchema);


export default Token;
