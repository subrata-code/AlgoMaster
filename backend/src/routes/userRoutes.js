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
router.get('/me/solved/:problemId', problemIdParam, validate, userController.solveStatus);
router.post('/me/solve/:problemId', problemIdParam, validate, userController.solve);
router.put('/me/onboarding', onboardingValidator, validate, userController.onboarding);
router.get('/me/suggested-problem', userController.suggested);
router.post('/me/events', userController.trackEvent);
router.get('/me/insights', userController.insights);
router.get('/me/notifications', userController.getNotifications);
router.put('/me/notifications/read', userController.markNotificationsRead);

export default router;
