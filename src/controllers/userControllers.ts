import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { credentialsFields } from '../utils/requiredFields';
import User from '../models/User';
import { genToken } from '../utils/tokenGenerator';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    for (const field of credentialsFields) {
      if (!request.body[field]) {
        return response.status(400).json({
          message: `Missing ${field} field`,
        });
      }

      if (typeof request.body[field] !== 'string') {
        return response.status(400).json({
          message: `${field} must be a string`,
        });
      }
    }

    if (password.length <= 5) {
      return response.status(400).json({
        message: 'Password must be at least 6 digits',
      });
    }

    try {
      const verifyExistingUser = await User.findOne({ username });

      if (verifyExistingUser) {
        return response
          .status(400)
          .json({ message: 'User already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const newUser = {
        username,
        password: hash,
      };

      const responseFromDb = await User.create(newUser);

      return response.status(201).json({
        accessToken: genToken(responseFromDb),
        userId: responseFromDb._id,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Failed to register user' });
    }
  }

  public async login(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    for (const field of credentialsFields) {
      if (!request.body[field]) {
        return response.status(400).json({
          message: `Missing ${field} field`,
        });
      }
    }

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return response.status(400).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response.status(400).json({ message: 'Password is invalid' });
      }

      return response.status(200).json({
        accessToken: genToken(user),
        userId: user._id,
      });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to login' });
    }
  }
}
