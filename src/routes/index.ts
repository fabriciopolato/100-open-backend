import { Router } from 'express';
import authRoutes from './auth.routes';
import companyRoutes from './company.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/company', companyRoutes);

export default router;
