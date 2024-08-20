import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URL = process.env.MONGO_URL;

export const dbConnection = () => {
  return mongoose.connect(MONGO_URL)
    .then(() => {
      console.log('HealthConnect Database has connected Successfully');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
      throw err; // Re-throw the error so that it can be caught by the caller
    });
};