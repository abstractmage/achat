import Mongoose from './../mongoose';

import User from './user';
import { encode, decode } from './../utils/token-service';
import { auth } from './../app.config.json';


export interface TokenDocument extends Mongoose.Document {
  type: 'access' | 'refresh';
  expiresOn: Date;
  value: string;
  userId: Mongoose.Types.ObjectId;
  fingerprint: string;
  decode(): ReturnType<typeof decode>;
}

export interface TokenModel<T extends Mongoose.Document> extends Mongoose.Model<T> {
  createUserTokens(userId: Mongoose.Types.ObjectId, fingerprint: string): Promise<[TokenDocument, TokenDocument]>;
  findByValue(value: string): Promise<TokenDocument | null>
  getPair(value: string): Promise<null | [TokenDocument, TokenDocument]>;
}

const tokenSchema = new Mongoose.Schema({
  type: {
    type: String,
    enum: ['access', 'refresh'],
    required: true,
  },
  expiresOn: {
    type: Date,
    required: true,
    expires: 0,
  },
  value: {
    type: String,
    required: true,
  },
  userId: {
    type: Mongoose.Types.ObjectId,
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

tokenSchema.statics.createUserTokens = async function (userId: Mongoose.Types.ObjectId, fingerprint: string) {
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
  try {
    const self: TokenModel<TokenDocument> = this;
    const token = await self.findOne({ value });
    token?.decode();

    return token;
  } catch {
    return null;
  }
};

tokenSchema.statics.getPair = async function (value: string) {
  const self: TokenModel<TokenDocument> = this;
  const firstToken = await self.findByValue(value);

  if (!firstToken) return null;

  const { userId } = firstToken.decode();
  const secondToken = (await self.findOne({ userId, fingerprint: firstToken.fingerprint }))!;

  return [firstToken, secondToken];
};

tokenSchema.methods.decode = function () {
  const self = this as TokenDocument;
  
  return decode(self.value);
}

const Token = Mongoose.model<TokenDocument, TokenModel<TokenDocument>>('Token', tokenSchema);


export default Token;
