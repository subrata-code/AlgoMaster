import { Router } from 'express';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/auth', authRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AlgoJourney API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
