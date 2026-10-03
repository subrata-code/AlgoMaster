import Notification from '../models/Notification.js';

export const create = async (userId, data) => {
  return await Notification.create({ user: userId, ...data });
};

export const getRecent = async (userId, limit = 20) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const markAllRead = async (userId) => {
  await Notification.updateMany({ user: userId, read: false }, { read: true });
};
