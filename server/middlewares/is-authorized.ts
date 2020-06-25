import { Request, Response, NextFunction } from 'express';
import handleErrors from '../utils/handle-errors';
import UnauthorizedError from '../utils/errors/unauthorized-error';


const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError({
        message: 'Operation Failed: Unauthorized',
      });
    }

    next();
  } catch (err) {
    handleErrors(res, err);
  }
};


export default isAuthorized;