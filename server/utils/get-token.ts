import { Request } from "express";

const getTokenVal = (req: Request, type: 'access' | 'refresh') => {
  const token: string | null = req.cookies[`${type}-token`] || null;
  
  return token;
};

export default getTokenVal;
