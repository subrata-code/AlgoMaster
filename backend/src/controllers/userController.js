import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import { asyncHandler, sendSuccess, AppError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';
import { configureCloudinary } from '../config/cloudinary.js';
import cloudinary from '../config/cloudinary.js';

export const stats = asyncHandler(async (req, res) => {
  const data = await userService.getStats(req.user._id);
  sendSuccess(res, { data });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  sendSuccess(res, { message: 'Profile updated', data: { user } });
});

export const avatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Avatar image is required', HTTP_STATUS.BAD_REQUEST);
  }

  const configured = configureCloudinary();
  if (!configured) {
    throw new AppError('Image uploads are not configured', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  const imageUrl = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'algomaster/avatars', resource_type: 'image', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    stream.end(req.file.buffer);
  });

  const user = await userService.updateAvatar(req.user._id, imageUrl);
  sendSuccess(res, { message: 'Avatar updated', data: { user } });
});

export const activity = asyncHandler(async (req, res) => {
  const items = await userService.getActivities(req.user._id, Number(req.query.limit) || 20);
  sendSuccess(res, { data: { activities: items } });
});

export const achievements = asyncHandler(async (req, res) => {
  const items = await userService.getAchievements(req.user._id);
  sendSuccess(res, { data: { achievements: items } });
});

export const bookmarks = asyncHandler(async (req, res) => {
  const items = await userService.getBookmarks(req.user._id);
  sendSuccess(res, { data: { bookmarks: items } });
});

export const bookmarkStatus = asyncHandler(async (req, res) => {
  const bookmarked = await userService.isBookmarked(req.user._id, req.params.problemId);
  sendSuccess(res, { data: { bookmarked } });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const result = await userService.toggleBookmark(req.user._id, req.params.problemId);
  sendSuccess(res, { data: result });
});

export const solve = asyncHandler(async (req, res) => {
  const result = await userService.markSolved(req.user._id, req.params.problemId);
  sendSuccess(res, { message: result.alreadySolved ? 'Already solved' : 'Marked as solved', data: result });
});

export const onboarding = asyncHandler(async (req, res) => {
  const data = await userService.updateOnboarding(req.user._id, req.body);
  sendSuccess(res, { message: 'Onboarding updated', data: { onboarding: data } });
});

export const suggested = asyncHandler(async (req, res) => {
  const problem = await userService.getSuggestedProblem(req.user._id);
  sendSuccess(res, { data: { problem } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  sendSuccess(res, { data: { user } });
});
