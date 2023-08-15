import { AuthUserDetails, TokenData } from "../types/auth.interface";
import jwt from 'jsonwebtoken';
import { UsersInterface } from "../models/users/users.interface";

class AuthHelper {
  public createToken(user: UsersInterface, remember?: boolean): TokenData {
    const dataStoredInToken: AuthUserDetails = { _id: user._id };
    const secret: string = process.env.JWT_SECRET;
    const oneDay = 60 * 60 * 24
    const expiresIn: number = remember ? oneDay * 365 : oneDay * 7;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }
}

export default new AuthHelper()