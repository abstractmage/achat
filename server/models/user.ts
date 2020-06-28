import mongoosePaginate from 'mongoose-paginate-v2';
import Mongoose from './../mongoose';
import Token from './token';


export interface UserDocument extends Mongoose.Document {
  _id: Mongoose.Types.ObjectId;
  nickname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel<T extends Mongoose.Document> extends Mongoose.PaginateModel<T> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByToken: (accessTokenVal: string) => Promise<UserDocument | null>;
}

const validateEmail = {
  validator: (val: string) => {
    const regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

    return regexp.test(val);
  },
  message: 'Invalid email format.',
};

const validatePassword = {
  validator: (val: string) => {
    const regexp = /[a-zA-Z0-9!@#\$%\^&\*\./]{6,}/g;

    return regexp.test(val);
  },
  message: 'Invalid character or length.',
};

const userSchema = new Mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Field is required.'],
    validate: {
      validator: (val: string) => {
        const regexp = /([a-zA-Z0-9_-]{2,32})/g;

        return regexp.test(val);
      },
      message: 'Invalid character or length.',
    },
  },
  email: {
    type: String,
    required: [true, 'Field is required.'],
    unique: true,
    validate: validateEmail,
  },
  password: {
    type: String,
    required: [true, 'Field is required.'],
    validate: validatePassword,
  },
}, {
  versionKey: false,
  timestamps: true,
  collection: 'users',
});

userSchema.statics.findByEmail = function (email: string) {
  const self: UserModel<UserDocument> = this;

  return self.findOne({ email });
};

userSchema.statics.findByToken = async function (accessTokenVal: string) {
  const self: UserModel<UserDocument> = this;
  const accessToken = accessTokenVal ? await Token.findByValue(accessTokenVal) : null;

  if (!accessToken) return null;

  const user = await self.findById(accessToken.userId);

  return user;
};

userSchema.plugin(mongoosePaginate);

const User = Mongoose.model<UserDocument>('User', userSchema) as UserModel<UserDocument>;


export default User;
