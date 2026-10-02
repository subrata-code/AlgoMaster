import { body, param, query } from 'express-validator';
import { DIFFICULTIES, PLATFORMS, PROBLEM_STATUS } from '../constants/index.js';

export const listProblemsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('difficulty').optional().isIn(['All', ...DIFFICULTIES]),
  query('platform').optional().isIn(['All', ...PLATFORMS]),
  query('sortBy').optional().isIn(['newest', 'oldest', 'difficulty', 'popular']),
  query('search').optional().isString().trim().isLength({ max: 80 }),
  query('topic').optional().isString().trim().isLength({ max: 80 }),
  query('company').optional().isString().trim().isLength({ max: 80 }),
];

const problemBody = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 160 }),
  body('link').trim().notEmpty().withMessage('Link is required').isURL().withMessage('Enter a valid URL'),
  body('difficulty').isIn(DIFFICULTIES).withMessage('Invalid difficulty'),
  body('platform').isIn(PLATFORMS).withMessage('Invalid platform'),
  body('companies').optional().isArray(),
  body('tags').isArray({ min: 1 }).withMessage('At least one tag is required'),
  body('hints').optional().isArray(),
  body('topics').optional().isArray(),
  body('solution').optional().isString(),
  body('conceptVideoUrl').optional().isString(),
  body('description').optional().isString(),
  body('status').optional().isIn(PROBLEM_STATUS),
  body('day').optional({ values: 'null' }).isInt({ min: 1, max: 100 }),
  body('isFeatured').optional().isBoolean(),
  body('isPremium').optional().isBoolean(),
];

export const createProblemValidator = problemBody;

export const updateProblemValidator = [
  param('id').notEmpty(),
  body('name').optional().trim().notEmpty().isLength({ max: 160 }),
  body('link').optional().trim().isURL(),
  body('difficulty').optional().isIn(DIFFICULTIES),
  body('platform').optional().isIn(PLATFORMS),
  body('companies').optional().isArray(),
  body('tags').optional().isArray({ min: 1 }),
  body('hints').optional().isArray(),
  body('topics').optional().isArray(),
  body('status').optional().isIn(PROBLEM_STATUS),
  body('day').optional({ values: 'null' }).isInt({ min: 1, max: 100 }),
];
