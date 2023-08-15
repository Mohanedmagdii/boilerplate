import { Request } from 'express';
import { UserInterface } from '../models/users/users.interface';

export interface AuthUserDetails {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserInterface;
}
