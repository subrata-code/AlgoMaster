/**
 * Multer upload middleware — prepared for future file uploads.
 * Not wired into routes in this phase.
 */
import multer from 'multer';
import path from 'path';
import { AppError } from './helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', HTTP_STATUS.BAD_REQUEST), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
