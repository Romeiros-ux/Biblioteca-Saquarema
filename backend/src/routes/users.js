import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, userController.listUsers);
router.get('/:id', authMiddleware, userController.getUser);
router.post('/', authMiddleware, checkPermission('user_create'), userController.createUser);
router.put('/:id', authMiddleware, checkPermission('user_edit'), userController.updateUser);
router.post('/:id/block', authMiddleware, checkPermission('user_block'), userController.toggleBlock);
router.get('/:id/history', authMiddleware, userController.getUserHistory);

export default router;
