import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL'];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Warning: ${key} is not set. Check your .env file.`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin1234!',
  clientUrl: (process.env.CLIENT_URL || 'http://localhost:5173').trim().replace(/\/$/, ''),
  adminUrl: (process.env.ADMIN_URL || 'http://localhost:5174').trim().replace(/\/$/, ''),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.EMAIL_FROM_NAME || 'AlgoMaster',
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
};

export default env;
