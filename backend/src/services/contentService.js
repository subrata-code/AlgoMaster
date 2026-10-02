import Content from '../models/Content.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { AppError } from '../utils/helpers.js';
import { CONTENT_TYPES, HTTP_STATUS } from '../constants/index.js';

const toItem = (doc) => {
  const json = doc.toJSON();
  return {
    id: json.id,
    ...json.data,
    order: json.order,
    slug: json.slug || json.data?.slug,
  };
};

export const listByType = async (type) => {
  const items = await Content.find({ type }).sort({ order: 1, createdAt: 1 });
  return items.map(toItem);
};

export const getHomeStats = async () => {
  const stored = await Content.findOne({ type: 'stats' });
  const [problems, learners, topics, companies] = await Promise.all([
    Problem.countDocuments({ status: 'published' }),
    User.countDocuments(),
    Content.countDocuments({ type: 'topic' }),
    Content.countDocuments({ type: 'company' }),
  ]);

  return {
    problems: stored?.data?.problems ?? problems,
    learners: stored?.data?.learners ?? learners,
    topics: stored?.data?.topics ?? topics,
    companies: stored?.data?.companies ?? companies,
  };
};

export const getTopic = async (slug) => {
  const item = await Content.findOne({ type: 'topic', slug });
  if (!item) throw new AppError('Topic not found', HTTP_STATUS.NOT_FOUND);
  return toItem(item);
};

export const getCompany = async (id) => {
  const item = isMongo(id)
    ? await Content.findOne({ type: 'company', _id: id })
    : await Content.findOne({
        type: 'company',
        $or: [{ slug: id.toLowerCase() }, { 'data.name': new RegExp(`^${id}$`, 'i') }],
      });
  if (!item) throw new AppError('Company not found', HTTP_STATUS.NOT_FOUND);
  return toItem(item);
};

const isMongo = (id) => /^[a-fA-F0-9]{24}$/.test(id);

export const getCurrentJourneyDay = async () => {
  const current = await Content.findOne({ type: 'journey', 'data.isCurrent': true });
  if (!current) return null;
  return toItem(current);
};

export const createItem = async (type, payload) => {
  if (!CONTENT_TYPES.includes(type)) {
    throw new AppError('Invalid content type', HTTP_STATUS.BAD_REQUEST);
  }
  const doc = await Content.create({
    type,
    slug: payload.slug,
    order: payload.order || 0,
    data: payload,
  });
  return toItem(doc);
};

export const updateItem = async (type, id, payload) => {
  const doc = await Content.findOne({ type, _id: id });
  if (!doc) throw new AppError('Content not found', HTTP_STATUS.NOT_FOUND);
  doc.data = { ...doc.data, ...payload };
  if (payload.slug !== undefined) doc.slug = payload.slug;
  if (payload.order !== undefined) doc.order = payload.order;
  await doc.save();
  return toItem(doc);
};

export const deleteItem = async (type, id) => {
  const doc = await Content.findOne({ type, _id: id });
  if (!doc) throw new AppError('Content not found', HTTP_STATUS.NOT_FOUND);
  await doc.deleteOne();
  return { success: true };
};
