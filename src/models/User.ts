import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

const User = model<IUser>('User', UserSchema);

export default User;
