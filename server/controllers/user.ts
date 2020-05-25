import { Router, Request, Response } from 'express';
import _ from 'lodash';
import mongoose from './../mongoose';

import BaseController from "../types/base-controller";
import User from './../models/user';
import validate, { required, email, string, match } from './../utils/validate';
import ValidationError from '../utils/errors/validation-error';
import handleErrors from '../utils/handle-errors';
import { encrypt } from './../utils/encryption';


interface CreateUserBody {
  nickname: any;
  email: any;
  password: any;
}

interface GetUsersQuery {
  query?: string;
  pagination?: mongoose.PaginateOptions;
}

const checkEmailUnique = (email: string) => async () => {
  const user = await User.findByEmail(email);

  if (user) return {
    success: false,
    value: email,
    message: 'Email is not unique',
  };

  return { success: true, value: email };
};

class UserController implements BaseController {
  router = Router();


  constructor() {
    this.initRoutes();
  }


  initRoutes() {
    this.router.get(['/user', '/users'], this.getUsers);
    this.router.post(['/user', '/users'], this.createUser);
  }


  private createUser = async (req: Request, res: Response) => {
    try {
      const data: CreateUserBody = req.body || {};
      const validationResult = await validate(data, {
        nickname: [required(), string()],
        email: [required(), string(), email(), checkEmailUnique(data.email)],
        password: [required(), string(), match(/[a-zA-Z0-9!@#\$%\^&\*\./]{6,}/g)],
      }, true);

      if (!validationResult.success) throw new ValidationError({
        message: 'User creation failed: Invalid data',
        errors: _.fromPairs(
          _.toPairs(validationResult.fields)
            .map(pair => [pair[0], { value: pair[1].value, message: pair[1].message! }])
        ),
      });

      const user = new User(data);

      user.password = await encrypt(data.password);

      await user.save();

      res.status(201)
        .json({
          ...user.toJSON(),
          password: undefined,
        });
    } catch (err) {
      handleErrors(res, err);
    }
  };


  private getUsers = async (req: Request, res: Response) => {
    const { query, pagination } = req.query as GetUsersQuery;
    const users = await User.paginate(
      query
        ? { $or: [{ email: { $regex: query } }, { nickname: { $regex: query } }] }
        : {},
      pagination
    );

    res.status(200)
      .json(users);
  };
}


export default UserController;
