import { Request, Response, NextFunction } from 'express';


type MiddleWare = (req: Request, res: Response, next: NextFunction) => void;


export default MiddleWare;
