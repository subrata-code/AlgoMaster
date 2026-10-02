import { Router } from 'express';
import * as problemController from '../controllers/problemController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import {
  createProblemValidator,
  listProblemsValidator,
  updateProblemValidator,
} from '../validators/problemValidators.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.get('/', listProblemsValidator, validate, problemController.list);
router.get('/featured', problemController.featured);
router.get('/recent', problemController.recent);
router.get('/current', problemController.current);
router.get('/day/:day', problemController.byDay);
router.get('/:id/related', problemController.related);
router.get('/:id', problemController.getOne);

router.post(
  '/',
  protect,
  authorize(ROLES.ADMIN),
  createProblemValidator,
  validate,
  problemController.create,
);
router.put(
  '/:id',
  protect,
  authorize(ROLES.ADMIN),
  updateProblemValidator,
  validate,
  problemController.update,
);
router.delete('/:id', protect, authorize(ROLES.ADMIN), problemController.remove);

export default router;
