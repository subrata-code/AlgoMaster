import { Router } from 'express';
import { body, param } from 'express-validator';
import * as adminController from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/stats', adminController.stats);
router.get('/users', adminController.users);
router.get('/problems', adminController.problems);
router.get('/problems/:id', adminController.problem);
router.put(
  '/users/:id/role',
  param('id').notEmpty(),
  body('role').isIn(Object.values(ROLES)),
  validate,
  adminController.updateRole,
);
router.delete('/users/:id', param('id').notEmpty(), validate, adminController.removeUser);

export default router;
