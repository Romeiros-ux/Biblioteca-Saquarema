import express from 'express';
import { catalogController } from '../controllers/catalogController.js';
import { authMiddleware, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, catalogController.listRecords);
router.get('/:id', authMiddleware, catalogController.getRecord);
router.post('/', authMiddleware, checkPermission('catalog_create'), catalogController.createRecord);
router.put('/:id', authMiddleware, checkPermission('catalog_edit'), catalogController.updateRecord);
router.delete('/:id', authMiddleware, checkPermission('catalog_delete'), catalogController.deleteRecord);
router.post('/search', authMiddleware, catalogController.advancedSearch);

export default router;
