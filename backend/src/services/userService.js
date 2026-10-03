import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Content from '../models/Content.js';
import ProblemEvent from '../models/ProblemEvent.js';
import * as notificationService from './notificationService.js';
import * as achievementService from './achievementService.js';
import { AppError, isValidObjectId } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const weekdayLabel = (date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

const resolveProblem = async (id) => {
  if (isValidObjectId(id)) {
    return Problem.findById(id);
  }
  return Problem.findOne({ slug: id });
};

const mapBookmark = (problemId, createdAt) => ({
  id: String(problemId),
  problemId: String(problemId),
  createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
});

const mapActivity = (activity) => ({
  id: String(activity._id),
  type: activity.type,
  title: activity.title,
  description: activity.description,
  timestamp: activity.timestamp?.toISOString?.() || activity.timestamp,
  problemId: activity.problemId ? String(activity.problemId) : undefined,
});

export const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const allowed = ['name', 'bio', 'location', 'github', 'linkedin', 'username', 'phone', 'college', 'degree', 'graduationYear', 'skills', 'targetCompanyType', 'targetRole', 'portfolio'];
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      user[key] = payload[key];
    }
  }

  await user.save();
  return user;
};

export const updateAvatar = async (userId, imageUrl) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  user.profileImage = imageUrl;
  await user.save();
  return user;
};

export const getBookmarks = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  return user.bookmarks.map((id) => mapBookmark(id, user.updatedAt));
};

export const isBookmarked = async (userId, problemId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  const problem = await resolveProblem(problemId);
  if (!problem) return false;
  return user.bookmarks.some((id) => String(id) === String(problem._id));
};

export const toggleBookmark = async (userId, problemId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const problem = await resolveProblem(problemId);
  if (!problem) throw new AppError('Problem not found', HTTP_STATUS.NOT_FOUND);

  const exists = user.bookmarks.some((id) => String(id) === String(problem._id));
  if (exists) {
    user.bookmarks = user.bookmarks.filter((id) => String(id) !== String(problem._id));
  } else {
    user.bookmarks.push(problem._id);
    user.pushActivity({
      type: 'bookmarked',
      title: `Bookmarked ${problem.name}`,
      description: 'Saved for later review',
      problemId: problem._id,
    });
  }

  await user.save();
  return { bookmarked: !exists };
};

export const isSolved = async (userId, problemId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  const problem = await resolveProblem(problemId);
  if (!problem) return false;
  return user.solvedProblems.some((item) => String(item.problem) === String(problem._id));
};

export const markSolved = async (userId, problemId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const problem = await resolveProblem(problemId);
  if (!problem) throw new AppError('Problem not found', HTTP_STATUS.NOT_FOUND);

  const already = user.solvedProblems.some((item) => String(item.problem) === String(problem._id));
  if (already) {
    return { alreadySolved: true, progress: user.progress };
  }

  user.solvedProblems.push({
    problem: problem._id,
    difficulty: problem.difficulty,
    topics: problem.topics,
    solvedAt: new Date(),
  });

  user.progress.solved += 1;
  const diffKey = problem.difficulty.toLowerCase();
  if (user.progress[diffKey] !== undefined) {
    user.progress[diffKey] += 1;
  }

  const today = startOfDay(new Date());
  const last = user.progress.lastSolvedAt ? startOfDay(user.progress.lastSolvedAt) : null;
  if (!last) {
    user.progress.streak = 1;
  } else {
    const diffDays = Math.round((today - last) / 86400000);
    if (diffDays === 0) {
      // same day — keep streak
    } else if (diffDays <= 2) {
      user.progress.streak += 1;
    } else {
      user.progress.streak = 1;
    }
  }
  user.progress.lastSolvedAt = new Date();
  user.progress.longestStreak = Math.max(user.progress.longestStreak, user.progress.streak);

  problem.solvedCount += 1;
  await problem.save();

  user.pushActivity({
    type: 'solved',
    title: `Solved ${problem.name}`,
    description: `Completed a ${problem.difficulty} problem on ${problem.platform}`,
    problemId: problem._id,
  });

  if (user.progress.streak > 0 && user.progress.streak % 7 === 0) {
    user.pushActivity({
      type: 'streak',
      title: `${user.progress.streak}-day streak!`,
      description: 'You maintained consistency',
    });
    await notificationService.create(user._id, {
      type: 'streak',
      title: `🔥 ${user.progress.streak}-day streak!`,
      message: 'Keep going!',
      link: '/dashboard',
    });
  }

  await achievementService.evaluateAchievements(user);

  await user.save();
  return { alreadySolved: false, progress: user.progress };
};

export const getActivities = async (userId, limit = 20) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  return user.activities.slice(0, limit).map(mapActivity);
};

export const getStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const totalProblems = await Problem.countDocuments({ status: 'published' });
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const weekMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  for (const item of user.solvedProblems) {
    const at = new Date(item.solvedAt);
    if (at >= weekAgo) {
      const label = weekdayLabel(at);
      if (weekMap[label] !== undefined) weekMap[label] += 1;
    }
  }

  const weeklyProgress = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    solved: weekMap[day],
  }));

  const topicTotals = await Problem.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$topics' },
    { $group: { _id: '$topics', total: { $sum: 1 } } },
  ]);

  const solvedByTopic = {};
  for (const item of user.solvedProblems) {
    for (const topic of item.topics || []) {
      solvedByTopic[topic] = (solvedByTopic[topic] || 0) + 1;
    }
  }

  const topicProgress = topicTotals
    .map((row) => ({
      topic: row._id,
      solved: solvedByTopic[row._id] || 0,
      total: row.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((row) => ({
      ...row,
      topic: row.topic
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
    }));

  return {
    solved: user.progress.solved,
    easy: user.progress.easy,
    medium: user.progress.medium,
    hard: user.progress.hard,
    streak: user.progress.streak,
    longestStreak: user.progress.longestStreak,
    bookmarks: user.bookmarks.length,
    totalProblems,
    weeklyProgress,
    topicProgress,
  };
};

export const getAchievements = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  return achievementService.getAchievementsWithProgress(user);
};

export const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const allowedFields = [
    'name', 'bio', 'location', 'github', 'linkedin', 'portfolio', 'college',
    'degree', 'graduationYear', 'targetCompanyType', 'targetRole', 'skills'
  ];

  allowedFields.forEach(field => {
    if (payload[field] !== undefined) {
      user[field] = payload[field];
    }
  });

  await user.save();
  return user;
};

export const updateOnboarding = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  if (payload.completed !== undefined) user.onboarding.completed = payload.completed;
  if (payload.difficultyPreference !== undefined) {
    user.onboarding.difficultyPreference = payload.difficultyPreference;
  }
  if (payload.tourCompleted !== undefined) user.onboarding.tourCompleted = payload.tourCompleted;
  await user.save();
  return user.onboarding;
};

export const getSuggestedProblem = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const solvedIds = user.solvedProblems.map((item) => item.problem);
  const preference = user.onboarding?.difficultyPreference;
  const difficulty =
    preference === 'Beginner' ? 'Easy' : preference === 'Advanced' ? 'Hard' : preference === 'Intermediate' ? 'Medium' : 'Easy';

  const match = await Problem.findOne({
    status: 'published',
    _id: { $nin: solvedIds },
    difficulty,
  }).sort({ solvedCount: -1 });

  if (match) return match;

  return Problem.findOne({
    status: 'published',
    _id: { $nin: solvedIds },
  }).sort({ difficulty: 1, solvedCount: -1 });
};

export const subscribeNewsletter = async (email) => {
  const existing = await Content.findOne({ type: 'stats' });
  if (existing) {
    existing.data = {
      ...existing.data,
      newsletterSubscribers: (existing.data.newsletterSubscribers || 0) + 1,
      lastSubscriber: email,
    };
    await existing.save();
  }
  return { success: true };
};

export const logEvent = async (userId, problemId, eventType) => {
  const problem = await resolveProblem(problemId);
  if (!problem) return; // silently ignore unknown problems
  await ProblemEvent.create({ user: userId, problem: problem._id, eventType });
};
