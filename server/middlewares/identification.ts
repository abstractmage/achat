import { Request, Response, NextFunction } from "express";

import Token from "../models/token";
import User from "../models/user";
import getTokenVal from "../utils/get-token";


const identification = async (req: Request, res: Response, next: NextFunction) => {
  const accessTokenVal = getTokenVal(req, 'access');
  const refreshTokenVal = getTokenVal(req, 'refresh');
  const accessToken = accessTokenVal ? await Token.findByValue(accessTokenVal) : null;
  const refreshToken = refreshTokenVal ? await Token.findByValue(refreshTokenVal) : null;

  console.log(accessTokenVal)
  console.log(refreshTokenVal)
  console.log(accessToken)
  console.log(refreshToken)

  if (accessToken) {
    res.locals.user = await User.findById(accessToken.userId);
  } else if (refreshToken) {
    const user = await User.findById(refreshToken.userId);
    const [newAccessToken, newRefreshToken] = await Token.createUserTokens(user!._id, refreshToken.fingerprint);
    
    res.locals.user = user;

    res
      .cookie('access-token', newAccessToken.value, {
        path: '/',
        expires: newAccessToken.expiresOn,
        httpOnly: true,
      })
      .cookie('refresh-token', newRefreshToken.value, {
        path: '/',
        expires: newRefreshToken.expiresOn,
        httpOnly: true,
      });
  }

  next();
};


export default identification;
