import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env';

interface ITokenPayload {
  id: string;
}

const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
): void | Response => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ message: 'No token provided' });
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2) {
    return response.status(401).json({ message: 'Invalid token' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ message: 'Badly formatted token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ITokenPayload;
    const { id } = decoded;

    request.user = { id };
    return next();
  } catch {
    return response
      .status(403)
      .json({ message: 'Failed to authenticate token.' });
  }
};

export default authenticate;
