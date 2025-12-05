import express from 'express';
import authRoutes from './auth.js';
import catalogRoutes from './catalog.js';
import circulationRoutes from './circulation.js';
import userRoutes from './users.js';
import importRoutes from './import.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use('/circulation', circulationRoutes);
router.use('/users', userRoutes);
router.use('/import', importRoutes);

export default router;
