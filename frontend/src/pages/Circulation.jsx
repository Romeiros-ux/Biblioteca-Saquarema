import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import { Add, AssignmentReturn } from '@mui/icons-material';
import api from '../services/api';

export default function Circulation() {
  const [lendings, setLendings] = useState([]);
  const [users, setUsers] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLendDialog, setOpenLendDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedHolding, setSelectedHolding] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lendingsRes, usersRes] = await Promise.all([
        api.get('/circulation/lendings'),
        api.get('/users'),
      ]);
      setLendings(lendingsRes.data.lendings || []);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (lendingId) => {
    if (!window.confirm('Confirmar devolução?')) return;

    try {
      await api.post(`/circulation/return/${lendingId}`);
      loadData();
    } catch (error) {
      console.error('Erro ao registrar devolução:', error);
      alert('Erro ao registrar devolução');
    }
  };

  const handleNewLending = async () => {
    if (!selectedUser || !selectedHolding) {
      alert('Selecione usuário e exemplar');
      return;
    }

    try {
      await api.post('/circulation/lend', {
        user_id: selectedUser.id,
        holding_id: selectedHolding.id,
      });
      setOpenLendDialog(false);
      setSelectedUser(null);
      setSelectedHolding(null);
      loadData();
    } catch (error) {
      console.error('Erro ao registrar empréstimo:', error);
      alert('Erro ao registrar empréstimo');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'overdue') return 'error';
    if (status === 'active') return 'success';
    return 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Ativo',
      returned: 'Devolvido',
      overdue: 'Atrasado',
    };
    return labels[status] || status;
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Circulação
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerenciar empréstimos e devoluções
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add sx={{ display: { xs: 'none', sm: 'block' } }} />} onClick={() => setOpenLendDialog(true)} fullWidth sx={{ display: { xs: 'flex', sm: 'inline-flex' } }}>
          Novo Empréstimo
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={4} sm={4} md={4}>
          <Paper sx={{ p: { xs: 1.5, sm: 3 }, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
              {lendings.filter((l) => l.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>
              Empréstimos Ativos
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Paper sx={{ p: { xs: 1.5, sm: 3 }, textAlign: 'center' }}>
            <Typography variant="h3" color="error" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
              {lendings.filter((l) => l.status === 'overdue').length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>
              Em Atraso
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Paper sx={{ p: { xs: 1.5, sm: 3 }, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
              {lendings.filter((l) => l.status === 'returned').length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>
              Devolvidos Hoje
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Obra</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Empréstimo</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Devolução</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Multa</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : lendings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum empréstimo encontrado
                </TableCell>
              </TableRow>
            ) : (
              lendings.map((lending) => (
                <TableRow key={lending.id}>
                  <TableCell>{lending.user_name}</TableCell>
                  <TableCell>{lending.title}</TableCell>
                  <TableCell>{new Date(lending.lend_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(lending.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(lending.status)}
                      color={getStatusColor(lending.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {lending.fine_amount ? `R$ ${lending.fine_amount.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell align="center">
                    {lending.status === 'active' || lending.status === 'overdue' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AssignmentReturn />}
                        onClick={() => handleReturn(lending.id)}
                      >
                        Devolver
                      </Button>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de novo empréstimo */}
      <Dialog open={openLendDialog} onClose={() => setOpenLendDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Empréstimo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => `${option.name} - ${option.cpf}`}
              value={selectedUser}
              onChange={(e, value) => setSelectedUser(value)}
              renderInput={(params) => <TextField {...params} label="Usuário" fullWidth />}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Código de Barras do Exemplar"
              helperText="Digite ou escaneie o código de barras"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLendDialog(false)}>Cancelar</Button>
          <Button onClick={handleNewLending} variant="contained">
            Emprestar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
