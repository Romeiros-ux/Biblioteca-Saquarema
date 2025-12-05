import express from 'express';
import { circulationController } from '../controllers/circulationController.js';
import { authMiddleware, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.post('/lend', authMiddleware, checkPermission('circulation_lend'), circulationController.lendItem);
router.post('/:id/return', authMiddleware, checkPermission('circulation_return'), circulationController.returnItem);
router.post('/:id/renew', authMiddleware, checkPermission('circulation_renew'), circulationController.renewLending);
router.get('/', authMiddleware, circulationController.listLendings);
router.get('/overdue', authMiddleware, circulationController.overdueLendings);

export default router;
