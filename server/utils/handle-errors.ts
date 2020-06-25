import { Response } from 'express';


export default (res: Response, err: any) => {
  console.log(err);

  res.status(err.statusCode || 500)
    .json(err);
};