import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import { configureCloudinary } from './config/cloudinary.js';

const startServer = async () => {
  try {
    await connectDB();
    configureCloudinary();

    app.listen(env.port, () => {
      console.log(`[server] AlgoJourney API running on port ${env.port}`);
      console.log(`[server] Environment: ${env.nodeEnv}`);
      console.log(`[server] Client URL: ${env.clientUrl}`);
    });
  } catch (error) {
    console.error('[server] Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
