import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  authController.login
);

router.post('/register',
  authMiddleware,
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  authController.register
);

router.get('/verify', authMiddleware, authController.verifyToken);

router.post('/change-password',
  authMiddleware,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  authController.changePassword
);

// Rotas de gerenciamento de usuários do sistema
router.get('/users', authMiddleware, authController.getUsers);

router.put('/users/:id',
  authMiddleware,
  body('name').notEmpty(),
  body('email').isEmail(),
  body('role_id').notEmpty(),
  authController.updateUser
);

router.delete('/users/:id', authMiddleware, authController.deleteUser);

// Rota para listar perfis/funções
router.get('/roles', authMiddleware, authController.getRoles);

export default router;
