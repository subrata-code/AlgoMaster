import * as adminService from '../services/adminService.js';
import * as problemService from '../services/problemService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';

export const stats = asyncHandler(async (_req, res) => {
  const data = await adminService.getStats();
  sendSuccess(res, { data });
});

export const users = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  sendSuccess(res, { data: { users: result.items, pagination: result.pagination } });
});

export const problems = asyncHandler(async (_req, res) => {
  const items = await adminService.listAllProblems();
  sendSuccess(res, { data: { problems: items } });
});

export const problem = asyncHandler(async (req, res) => {
  const item = await problemService.getProblem(req.params.id, { includeDrafts: true });
  sendSuccess(res, { data: { problem: item } });
});

export const updateRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  sendSuccess(res, { message: 'Role updated', data: { user } });
});

export const removeUser = asyncHandler(async (req, res) => {
  await adminService.removeUser(req.params.id);
  sendSuccess(res, { message: 'User deleted successfully' });
});
