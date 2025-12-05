import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Visibility,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import api from '../services/api';

export default function ImportBooks() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [openConfirmClear, setOpenConfirmClear] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(null);
      setResult(null);
      setError('');
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPreview(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao visualizar arquivo');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao importar arquivo');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    setLoading(true);
    setError('');

    try {
      await api.delete('/import/books/clear-all');
      setOpenConfirmClear(false);
      setResult(null);
      setPreview(null);
      alert('Todos os livros foram removidos com sucesso!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao limpar acervo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Importar Livros
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Importe livros de uma planilha Excel (.xlsx, .xls)
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert
          severity={result.errors > 0 ? 'warning' : 'success'}
          sx={{ mb: 3 }}
          icon={result.errors > 0 ? <ErrorIcon /> : <CheckCircle />}
        >
          <Typography variant="body1" gutterBottom>
            <strong>Importação Concluída!</strong>
          </Typography>
          <Typography variant="body2">
            Total: {result.total} | Importados: {result.imported} | Erros: {result.errors}
          </Typography>
          {result.errorDetails && result.errorDetails.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Primeiros erros:
              </Typography>
              {result.errorDetails.map((err, index) => (
                <Typography key={index} variant="caption" display="block">
                  • {err.title}: {err.error}
                </Typography>
              ))}
            </Box>
          )}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Selecione o arquivo Excel
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            accept=".xlsx,.xls,.ods"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Escolher Arquivo
            </Button>
          </label>

          {file && (
            <Alert severity="info" icon={<CheckCircle />}>
              Arquivo selecionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </Alert>
          )}

          {file && (
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handlePreview}
                disabled={loading}
                fullWidth
              >
                Visualizar Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={handleImport}
                disabled={loading}
                fullWidth
              >
                Importar Livros
              </Button>
            </Box>
          )}
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {preview && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preview do Arquivo
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total de registros: <Chip label={preview.total} color="primary" size="small" />
          </Typography>

          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Autor</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Editora</TableCell>
                  <TableCell>Ano</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.preview.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.title || 'Sem título'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {book.author || '-'}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {book.publisher || '-'}
                    </TableCell>
                    <TableCell>{book.year || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Mostrando apenas os primeiros 10 registros
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'error.main', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          ⚠️ Zona de Perigo
        </Typography>
        <Typography variant="body2" gutterBottom>
          Remover todos os livros do acervo. Esta ação não pode ser desfeita!
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={() => setOpenConfirmClear(true)}
          disabled={loading}
          sx={{ mt: 2, bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: 'grey.100' } }}
        >
          Limpar Todo o Acervo
        </Button>
      </Paper>

      {/* Dialog de confirmação para limpar acervo */}
      <Dialog open={openConfirmClear} onClose={() => setOpenConfirmClear(false)}>
        <DialogTitle>⚠️ Confirmar Limpeza do Acervo</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja remover <strong>TODOS</strong> os livros do acervo?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmClear(false)}>Cancelar</Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Sim, Limpar Tudo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
