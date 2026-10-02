import * as problemService from '../services/problemService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

export const list = asyncHandler(async (req, res) => {
  const result = await problemService.listProblems(req.query);
  sendSuccess(res, {
    data: {
      data: result.items,
      pagination: result.pagination,
    },
  });
});

export const featured = asyncHandler(async (_req, res) => {
  const items = await problemService.getFeatured();
  sendSuccess(res, { data: { problems: items } });
});

export const recent = asyncHandler(async (req, res) => {
  const items = await problemService.getRecent(Number(req.query.limit) || 6);
  sendSuccess(res, { data: { problems: items } });
});

export const byDay = asyncHandler(async (req, res) => {
  const problem = await problemService.getByDay(req.params.day);
  sendSuccess(res, { data: { problem } });
});

export const related = asyncHandler(async (req, res) => {
  const problems = await problemService.getRelated(req.params.id, Number(req.query.limit) || 4);
  sendSuccess(res, { data: { problems } });
});

export const current = asyncHandler(async (_req, res) => {
  const problem = await problemService.getCurrentDayProblem();
  sendSuccess(res, { data: { problem } });
});

export const getOne = asyncHandler(async (req, res) => {
  const problem = await problemService.getProblem(req.params.id, { trackView: true });
  sendSuccess(res, { data: { problem } });
});

export const create = asyncHandler(async (req, res) => {
  const problem = await problemService.createProblem(req.body);
  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Problem created',
    data: { problem },
  });
});

export const update = asyncHandler(async (req, res) => {
  const problem = await problemService.updateProblem(req.params.id, req.body);
  sendSuccess(res, { message: 'Problem updated', data: { problem } });
});

export const remove = asyncHandler(async (req, res) => {
  await problemService.deleteProblem(req.params.id);
  sendSuccess(res, { message: 'Problem deleted', data: { success: true } });
});
