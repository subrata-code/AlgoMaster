import mongoose from 'mongoose';
import env from './env.js';

/**
 * Connect to MongoDB Atlas (or any MongoDB URI from env).
 * Does not throw on empty URI during boot — server can still start;
 * connection errors are logged and rethrown for visibility.
 */
const connectDB = async () => {
  if (!env.mongodbUri) {
    console.error('[db] MONGODB_URI is missing. Set it in backend/.env');
    throw new Error('MONGODB_URI is required');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(env.mongodbUri);

  console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
