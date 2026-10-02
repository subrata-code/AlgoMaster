import * as contentService from '../services/contentService.js';
import * as userService from '../services/userService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

export const topics = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { topics: await contentService.listByType('topic') } });
});

export const topic = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { topic: await contentService.getTopic(req.params.slug) } });
});

export const companies = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { companies: await contentService.listByType('company') } });
});

export const company = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { company: await contentService.getCompany(req.params.id) } });
});

export const roadmap = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { roadmap: await contentService.listByType('roadmap') } });
});

export const journey = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { journey: await contentService.listByType('journey') } });
});

export const currentJourney = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { day: await contentService.getCurrentJourneyDay() } });
});

export const testimonials = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { testimonials: await contentService.listByType('testimonial') } });
});

export const faqs = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { faqs: await contentService.listByType('faq') } });
});

export const stats = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: { stats: await contentService.getHomeStats() } });
});

export const newsletter = asyncHandler(async (req, res) => {
  const result = await userService.subscribeNewsletter(req.body.email);
  sendSuccess(res, { message: 'Subscribed', data: result });
});

export const create = asyncHandler(async (req, res) => {
  const item = await contentService.createItem(req.params.type, req.body);
  sendSuccess(res, { statusCode: HTTP_STATUS.CREATED, message: 'Content created', data: { item } });
});

export const update = asyncHandler(async (req, res) => {
  const item = await contentService.updateItem(req.params.type, req.params.id, req.body);
  sendSuccess(res, { message: 'Content updated', data: { item } });
});

export const remove = asyncHandler(async (req, res) => {
  await contentService.deleteItem(req.params.type, req.params.id);
  sendSuccess(res, { message: 'Content deleted', data: { success: true } });
});
