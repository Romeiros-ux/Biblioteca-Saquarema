import express from 'express';
import { publicCatalogController } from '../controllers/publicCatalogController.js';

const router = express.Router();

// Rotas públicas - sem autenticação
router.get('/search', publicCatalogController.searchBooks);
router.get('/featured', publicCatalogController.getFeaturedBooks);
router.get('/:id', publicCatalogController.getBookDetails);

export default router;
