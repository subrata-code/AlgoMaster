import { body, param } from 'express-validator';
import { ONBOARDING_DIFFICULTIES } from '../constants/index.js';

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }),
  body('bio').optional().isString().isLength({ max: 400 }),
  body('location').optional().isString().isLength({ max: 80 }),
  body('github').optional().isString().isLength({ max: 80 }),
  body('linkedin').optional().isString().isLength({ max: 80 }),
  body('username').optional().trim().isLength({ min: 2, max: 40 }).matches(/^[a-zA-Z0-9._-]+$/),
];

export const problemIdParam = [param('problemId').notEmpty().withMessage('Problem id is required')];

export const onboardingValidator = [
  body('completed').optional().isBoolean(),
  body('tourCompleted').optional().isBoolean(),
  body('difficultyPreference').optional().isIn(ONBOARDING_DIFFICULTIES),
];

export const newsletterValidator = [
  body('email').trim().notEmpty().isEmail().withMessage('Enter a valid email').normalizeEmail(),
];
