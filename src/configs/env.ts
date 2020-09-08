import 'dotenv/config';

export const PORT = process.env.PORT || 3001;
export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/100openStartups';
export const JWT_SECRET = process.env.JWT_SECRET || 'keyboardcat';
