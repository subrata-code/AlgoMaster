import User from '../models/User.js';
import Problem from '../models/Problem.js';
import { formatPagination } from '../utils/helpers.js';
import { AppError } from '../utils/helpers.js';
import { HTTP_STATUS, ROLES } from '../constants/index.js';

export const getStats = async () => {
  const [totalProblems, published, drafts, totalUsers, viewsAgg] = await Promise.all([
    Problem.countDocuments(),
    Problem.countDocuments({ status: 'published' }),
    Problem.countDocuments({ status: 'draft' }),
    User.countDocuments(),
    Problem.aggregate([{ $group: { _id: null, views: { $sum: '$viewCount' } } }]),
  ]);

  return {
    totalProblems,
    published,
    drafts,
    totalUsers,
    viewsThisWeek: viewsAgg[0]?.views || 0,
  };
};

export const listUsers = async ({ page = 1, pageSize = 20, search, sort } = {}) => {
  const query = {};
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { username: new RegExp(search, 'i') },
    ];
  }

  let sortObj = { createdAt: -1 };
  if (sort === 'streak') sortObj = { 'stats.maxStreak': -1 };
  if (sort === 'solved') sortObj = { 'stats.totalSolved': -1 };

  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.min(50, Math.max(1, Number(pageSize) || 20));
  const skip = (pageNum - 1) * size;

  const [items, total] = await Promise.all([
    User.find(query).sort(sortObj).skip(skip).limit(size),
    User.countDocuments(query),
  ]);

  return { items, pagination: formatPagination(pageNum, size, total) };
};

export const updateUserRole = async (id, role) => {
  if (!Object.values(ROLES).includes(role)) {
    throw new AppError('Invalid role', HTTP_STATUS.BAD_REQUEST);
  }
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  user.role = role;
  await user.save();
  return user;
};

export const listAllProblems = async () =>
  Problem.find().sort({ updatedAt: -1 });

export const removeUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  if (user.role === ROLES.ADMIN) throw new AppError('Cannot delete an admin user', HTTP_STATUS.BAD_REQUEST);
  await user.deleteOne();
};
