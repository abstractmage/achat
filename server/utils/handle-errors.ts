import { Response } from 'express';


export default (res: Response, err: any) => {
  res.status(err.statusCode || 500)
    .json(err);
};