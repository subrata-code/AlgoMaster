import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/prefill', resumeController.prefill);
router.post('/parse-jd', resumeController.parseJD);
router.post('/generate', resumeController.generate);
router.get('/list', resumeController.list);
router.get('/:id/download', resumeController.download);
router.delete('/:id', resumeController.remove);

export default router;
