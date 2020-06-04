import { Request, Response, NextFunction } from "express";

import Token from "../models/token";
import User from "../models/user";


const identification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 'access-token': accessTokenVal, 'refresh-token': refreshTokenVal } = req.cookies;

    console.log(accessTokenVal, refreshTokenVal);

    if (accessTokenVal) {
      const accessToken = await Token.findByValue(accessTokenVal);
      
      if (!accessToken) throw new Error;

      try {
        const tokenData = accessToken.decode();
        const user = await User.findById(tokenData.userId);
        console.log('identification access ---', user, tokenData);
        res.locals.user = user;
      } catch (err) {
        await accessToken.remove();
        throw err;
      }
    } else if (refreshTokenVal) {
      const refreshToken = await Token.findByValue(refreshTokenVal);
      
      if (!refreshToken) throw new Error;

      try {
        const tokenData = refreshToken.decode();
        const user = await User.findById(tokenData.userId);
        const [newAccessToken, newRefreshToken] = await Token.createUserTokens(user!._id, refreshToken.fingerprint);
        res.locals.user = user;
        res
          .cookie('access-token', newAccessToken.value, {
            path: '/',
            expires: newAccessToken.expiresOn,
          })
          .cookie('refresh-token', newRefreshToken.value, {
            path: '/',
            expires: newRefreshToken.expiresOn,
          })
      } catch (err) {
        await refreshToken.remove();
        throw err;
      }
    }

    next();
  } catch (err) {
    console.log('---', err);
    res
      .clearCookie('access-token')
      .clearCookie('refresh-token');
    next();
  }
};


export default identification;
