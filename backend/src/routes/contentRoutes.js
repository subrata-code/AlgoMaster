import { Router } from 'express';
import * as contentController from '../controllers/contentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { newsletterValidator } from '../validators/userValidators.js';
import { ROLES } from '../constants/index.js';
import { CONTENT_TYPES } from '../constants/index.js';
import { param } from 'express-validator';

const router = Router();

router.get('/topics', contentController.topics);
router.get('/topics/:slug', contentController.topic);
router.get('/companies', contentController.companies);
router.get('/companies/:id', contentController.company);
router.get('/roadmap', contentController.roadmap);
router.get('/journey', contentController.journey);
router.get('/journey/current', contentController.currentJourney);
router.get('/testimonials', contentController.testimonials);
router.get('/faqs', contentController.faqs);
router.get('/stats', contentController.stats);
router.post('/newsletter', newsletterValidator, validate, contentController.newsletter);

const typeParam = param('type').isIn(CONTENT_TYPES).withMessage('Invalid content type');

router.post('/:type', protect, authorize(ROLES.ADMIN), typeParam, validate, contentController.create);
router.put('/:type/:id', protect, authorize(ROLES.ADMIN), typeParam, validate, contentController.update);
router.delete('/:type/:id', protect, authorize(ROLES.ADMIN), typeParam, validate, contentController.remove);

export default router;
