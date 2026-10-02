import Problem from '../models/Problem.js';
import { AppError, formatPagination, isValidObjectId, slugify } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

const DIFFICULTY_ORDER = { Easy: 1, Medium: 2, Hard: 3 };

const topicsFromTags = (tags = []) =>
  tags.map((tag) => slugify(tag)).filter(Boolean);

const uniqueSlug = async (name, excludeId) => {
  const base = slugify(name) || 'problem';
  let slug = base;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Problem.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (!existing) return slug;
    slug = `${base}-${i}`;
    i += 1;
  }
};

const findByIdOrSlug = async (id, { includeDrafts = false } = {}) => {
  const filter = includeDrafts ? {} : { status: 'published' };
  if (isValidObjectId(id)) {
    return Problem.findOne({ _id: id, ...filter });
  }
  return Problem.findOne({ slug: id, ...filter });
};

export const listProblems = async ({
  search,
  difficulty,
  platform,
  topic,
  company,
  sortBy = 'newest',
  page = 1,
  pageSize = 9,
  includeDrafts = false,
} = {}) => {
  const query = includeDrafts ? {} : { status: 'published' };

  if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
  if (platform && platform !== 'All') query.platform = platform;
  if (company) query.companies = company;
  if (topic) {
    query.$or = [{ topics: topic.toLowerCase() }, { tags: new RegExp(`^${topic}$`, 'i') }];
  }
  if (search) {
    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { name: new RegExp(search, 'i') },
          { tags: new RegExp(search, 'i') },
          { companies: new RegExp(search, 'i') },
        ],
      },
    ];
  }

  let sort = { createdAt: -1 };
  if (sortBy === 'oldest') sort = { createdAt: 1 };
  if (sortBy === 'popular') sort = { solvedCount: -1 };
  if (sortBy === 'difficulty') sort = { difficulty: 1, createdAt: -1 };

  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.min(50, Math.max(1, Number(pageSize) || 9));
  const skip = (pageNum - 1) * size;

  let itemsQuery = Problem.find(query);

  if (sortBy === 'difficulty') {
    const all = await Problem.find(query);
    all.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    const total = all.length;
    const items = all.slice(skip, skip + size);
    return { items, pagination: formatPagination(pageNum, size, total) };
  }

  const [items, total] = await Promise.all([
    itemsQuery.sort(sort).skip(skip).limit(size),
    Problem.countDocuments(query),
  ]);

  return { items, pagination: formatPagination(pageNum, size, total) };
};

export const getProblem = async (id, { includeDrafts = false, trackView = false } = {}) => {
  const problem = await findByIdOrSlug(id, { includeDrafts });
  if (!problem) {
    throw new AppError('Problem not found', HTTP_STATUS.NOT_FOUND);
  }
  if (trackView) {
    problem.viewCount += 1;
    await problem.save();
  }
  return problem;
};

export const getFeatured = async (limit = 6) =>
  Problem.find({ isFeatured: true, status: 'published' }).sort({ solvedCount: -1 }).limit(limit);

export const getRecent = async (limit = 6) =>
  Problem.find({ status: 'published' }).sort({ createdAt: -1 }).limit(limit);

export const getByDay = async (day) => {
  const problem = await Problem.findOne({ day: Number(day), status: 'published' });
  return problem;
};

export const getRelated = async (id, limit = 4) => {
  const current = await findByIdOrSlug(id, { includeDrafts: true });
  if (!current) return [];
  return Problem.find({
    _id: { $ne: current._id },
    status: 'published',
    $or: [{ tags: { $in: current.tags } }, { difficulty: current.difficulty }],
  }).limit(limit);
};

export const getCurrentDayProblem = async () => {
  const featured = await Problem.findOne({ day: { $ne: null }, status: 'published' }).sort({ day: -1 });
  return featured;
};

export const createProblem = async (payload) => {
  const tags = payload.tags || [];
  const slug = await uniqueSlug(payload.name);
  const problem = await Problem.create({
    ...payload,
    slug,
    topics: payload.topics?.length ? payload.topics : topicsFromTags(tags),
    isPremium: payload.isPremium ?? Boolean(payload.solution || payload.conceptVideoUrl),
  });
  return problem;
};

export const updateProblem = async (id, payload) => {
  const problem = await findByIdOrSlug(id, { includeDrafts: true });
  if (!problem) {
    throw new AppError('Problem not found', HTTP_STATUS.NOT_FOUND);
  }

  const next = { ...payload };
  if (next.name && next.name !== problem.name) {
    next.slug = await uniqueSlug(next.name, problem._id);
  }
  if (next.tags && !next.topics) {
    next.topics = topicsFromTags(next.tags);
  }
  if (next.solution !== undefined || next.conceptVideoUrl !== undefined) {
    next.isPremium = Boolean(
      (next.solution !== undefined ? next.solution : problem.solution) ||
        (next.conceptVideoUrl !== undefined ? next.conceptVideoUrl : problem.conceptVideoUrl),
    );
  }

  Object.assign(problem, next);
  await problem.save();
  return problem;
};

export const deleteProblem = async (id) => {
  const problem = await findByIdOrSlug(id, { includeDrafts: true });
  if (!problem) {
    throw new AppError('Problem not found', HTTP_STATUS.NOT_FOUND);
  }
  await problem.deleteOne();
  return { success: true };
};
