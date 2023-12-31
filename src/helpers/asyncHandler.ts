import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default (execution: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  console.log('asynnnnc')
  execution(req, res, next).catch(next);
};