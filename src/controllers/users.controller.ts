import { NextFunction, Request, Response } from 'express';
import userService from '../services/users/users.service';
import { RequestWithUser } from '../types/auth.interface';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: '', message: '' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
