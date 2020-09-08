import mongoose from 'mongoose';
import { MONGO_URI } from '../configs/env';

const db = mongoose.connection;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

db.once('open', () => {
  console.log(`Connected to ${db.name} database successfully`);
});

db.on('error', console.error.bind(console, 'connection error:'));
