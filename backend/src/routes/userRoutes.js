import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../utils/upload.js';
import {
  onboardingValidator,
  problemIdParam,
  updateProfileValidator,
} from '../validators/userValidators.js';

const router = Router();

router.use(protect);

router.get('/me', userController.me);
router.get('/me/stats', userController.stats);
router.put('/me', updateProfileValidator, validate, userController.updateMe);
router.put('/me/avatar', upload.single('avatar'), userController.avatar);
router.get('/me/activity', userController.activity);
router.get('/me/achievements', userController.achievements);
router.get('/me/bookmarks', userController.bookmarks);
router.get('/me/bookmarks/:problemId', problemIdParam, validate, userController.bookmarkStatus);
router.post('/me/bookmarks/:problemId', problemIdParam, validate, userController.toggleBookmark);
router.post('/me/solve/:problemId', problemIdParam, validate, userController.solve);
router.put('/me/onboarding', onboardingValidator, validate, userController.onboarding);
router.get('/me/suggested-problem', userController.suggested);

export default router;
