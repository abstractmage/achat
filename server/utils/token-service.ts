import jwt from 'jsonwebtoken';

import mongoose from '../mongoose';
import { auth } from '../app.config.json';


export const encode = (id: mongoose.Types.ObjectId, type: 'access' | 'refresh') =>
  jwt.sign({ userId: id, type }, auth.secret, { expiresIn: auth.options[type].expiresIn });


export const decode = (tokenValue: string) =>
  jwt.verify(tokenValue, auth.secret) as { userId: string, type: 'access' | 'refresh' };
