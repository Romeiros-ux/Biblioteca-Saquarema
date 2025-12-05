import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Edit, Delete, Add, Visibility } from '@mui/icons-material';
import api from '../services/api';

export default function Catalog() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const response = await api.get('/catalog');
      setRecords(response.data.records || []);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRecords();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/catalog/search?q=${searchQuery}`);
      setRecords(response.data.records || []);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Catálogo Bibliográfico
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerenciar acervo da biblioteca
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Pesquisar por título, autor, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search sx={{ display: { xs: 'none', sm: 'block' } }} />}
              onClick={handleSearch}
              sx={{ height: { xs: 40, sm: 40 } }}
            >
              Buscar
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add sx={{ display: { xs: 'none', sm: 'block' } }} />}
              sx={{ height: { xs: 40, sm: 40 } }}
            >
              Novo
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Autor</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>ISBN</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Ano</TableCell>
              <TableCell>Exemplares</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {record.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                      {record.author}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{record.author}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{record.isbn}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{record.publication_year}</TableCell>
                  <TableCell>
                    <Chip label={record.total_holdings || 0} size="small" color="primary" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleViewDetails(record)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de detalhes */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Registro</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRecord.title}
              </Typography>
              {selectedRecord.subtitle && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {selectedRecord.subtitle}
                </Typography>
              )}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Autor:
                  </Typography>
                  <Typography variant="body1">{selectedRecord.author}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ISBN:
                  </Typography>
                  <Typography variant="body1">{selectedRecord.isbn}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Editora:
                  </Typography>
                  <Typography variant="body1">{selectedRecord.publisher}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ano:
                  </Typography>
                  <Typography variant="body1">{selectedRecord.publication_year}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Descrição:
                  </Typography>
                  <Typography variant="body1">{selectedRecord.description}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
