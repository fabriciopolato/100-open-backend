import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { JWT_SECRET } from '../configs/env';

export const genToken = (user: IUser): string => {
  const { _id } = user;
  return jwt.sign({ id: _id }, JWT_SECRET);
};
