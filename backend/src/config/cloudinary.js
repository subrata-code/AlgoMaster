import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

/**
 * Cloudinary placeholder configuration.
 * Upload flows are not implemented in this phase.
 * Call configureCloudinary() when file uploads are added.
 */
export const configureCloudinary = () => {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('[cloudinary] Credentials not configured. Skipping setup.');
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  console.log('[cloudinary] Configured successfully');
  return cloudinary;
};

export default cloudinary;
