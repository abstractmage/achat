import { Router, Request, Response } from 'express';
import _ from 'lodash';

import BaseController from './../types/base-controller';
import handleErrors from '../utils/handle-errors';
import validate, { required, string, email, match } from './../utils/validate';
import ValidationError from '../utils/errors/validation-error';
import User from './../models/user';
import { compare } from '../utils/encryption';
import Token from '../models/token';
import getTokenVal from '../utils/get-token';
import BadRequestError from '../utils/errors/bad-request-error';
import isAuthorized from '../middlewares/is-authorized';


interface SignInBody {
  email: any;
  password: any;
  fingerprint: any;
}

const checkEmail = (email: string) => async () => {
  const user = await User.findByEmail(email);

  if (!user) return {
    success: false,
    value: email,
    message: 'Wrong email or password',
  };

  return { success: true, value: email };
};

class AuthController implements BaseController {
  router = Router();


  constructor() {
    this.initRoutes();
  }


  initRoutes() {
    this.router.post(['/auth/sign-in'], this.signIn);
    this.router.get(['/auth/user'], isAuthorized, this.getAuthUser);
    this.router.post(['/auth/refresh-tokens'], this.refreshTokens);
    this.router.post(['/auth/sign-out'], this.signOut);
  }


  private signIn = async (req: Request, res: Response) => {
    try {
      const data: SignInBody = req.body || {};
      const validationResult = await validate(data, {
        email: [required(), string(), email(), checkEmail(data.email)],
        password: [required(), string(), match(/[a-zA-Z0-9!@#\$%\^&\*\./]{6,}/g)],
        fingerprint: [required(), string()],
      });

      if (!validationResult.success) throw new ValidationError({
        message: 'Signing in failed: Invalid data',
        errors: _.fromPairs(
          _.toPairs(validationResult.fields)
            .map(pair => [pair[0], { value: pair[1].value, message: pair[1].message! }])
        ),
      });

      const user = await User.findByEmail(data.email).then(doc => doc!);

      if (!(await compare(data.password, user.password))) throw new ValidationError({
        message: 'Signing in failed: Invalid data',
        errors: {
          email: {
            value: data.email,
            message: 'Wrong email or password',
          },
        },
      });

      const [accessToken, refreshToken] = await Token.createUserTokens(user._id, data.fingerprint);

      res.status(200)
        .cookie('refresh-token', refreshToken.value, {
          path: '/',
          expires: refreshToken.expiresOn,
          httpOnly: true,
        })
        .cookie('access-token', accessToken.value, {
          path: '/',
          expires: accessToken.expiresOn,
          httpOnly: true,
        })
        .json({ user });
    } catch (err) {
      handleErrors(res, err);
    }
  };


  private refreshTokens = async (req: Request, res: Response) => {
    try {
      const refreshTokenVal = getTokenVal(req, 'refresh');
      const refreshToken = refreshTokenVal ? await Token.findByValue(refreshTokenVal) : null;

      if (!refreshToken) throw new BadRequestError({
        message: 'Token Refresh Failed: invalid token',
      });

      const user = await User.findById(refreshToken.userId);
      const [newAccessToken, newRefreshToken] = await Token.createUserTokens(user!._id, refreshToken.fingerprint);

      res.status(201)
        .cookie('access-token', newAccessToken.value, {
          path: '/',
          expires: newAccessToken.expiresOn,
          httpOnly: true,
        })
        .cookie('refresh-token', newRefreshToken.value, {
          path: '/',
          expires: newRefreshToken.expiresOn,
          httpOnly: true,
        })
        .json({ user });
    } catch (err) {
      handleErrors(res, err);
    }
  };


  private signOut = async (req: Request, res: Response) => {
    res.status(200)
      .clearCookie('refresh-token')
      .clearCookie('access-token')
      .json({});
  };


  private getAuthUser = (req: Request, res: Response) => {
    res.status(200)
      .json({
        user: res.locals.user || null,
      });
  };
}


export default AuthController;
