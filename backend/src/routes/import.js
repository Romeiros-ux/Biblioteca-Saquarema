import express from 'express';
import multer from 'multer';
import { importController } from '../controllers/importController.js';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Configurar multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Use .xlsx, .xls ou .ods'));
    }
  },
});

// Verificar configuração da SERVICE_KEY
router.get('/check-config',
  authMiddleware,
  checkRole(['admin', 'librarian']),
  importController.checkConfig
);

// Preview do arquivo Excel (não salva no banco)
router.post('/preview',
  authMiddleware,
  checkRole(['admin', 'librarian']),
  upload.single('file'),
  importController.previewExcel
);

// Importar livros do Excel
router.post('/books',
  authMiddleware,
  checkRole(['admin', 'librarian']),
  upload.single('file'),
  importController.importFromExcel
);

// Limpar todos os livros (cuidado!)
router.delete('/books/clear-all',
  authMiddleware,
  checkRole(['admin']),
  importController.clearAllBooks
);

export default router;
