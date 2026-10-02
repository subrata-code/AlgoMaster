import { Router } from 'express';
import authRoutes from './authRoutes.js';
import problemRoutes from './problemRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import contentRoutes from './contentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/problems', problemRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/content', contentRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AlgoJourney API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
