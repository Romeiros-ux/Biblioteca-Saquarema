import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { Save, Lock, Add, Edit, Delete, PersonAdd } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function Settings() {
  const { user } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    active: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [librarySettings, setLibrarySettings] = useState({
    lendingDays: 7,
    renewalDays: 7,
    maxRenewals: 2,
    finePerDay: 2.0,
    maxActiveLendings: 3,
    enableFines: true,
    enableReservations: true,
  });

  useEffect(() => {
    loadEmployees();
    loadRoles();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/auth/users');
      setEmployees(response.data.users || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setError('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await api.get('/auth/roles');
      setRoles(response.data.roles || [
        { id: '1', name: 'Administrador' },
        { id: '2', name: 'Bibliotecário' },
        { id: '3', name: 'Assistente' },
      ]);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    }
  };

  const handleOpenEmployeeDialog = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmployeeForm({
        name: employee.name,
        email: employee.email,
        password: '',
        role_id: employee.role_id,
        active: employee.active,
      });
    } else {
      setEditingEmployee(null);
      setEmployeeForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
        active: true,
      });
    }
    setOpenEmployeeDialog(true);
  };

  const handleCloseEmployeeDialog = () => {
    setOpenEmployeeDialog(false);
    setEditingEmployee(null);
    setEmployeeForm({
      name: '',
      email: '',
      password: '',
      role_id: '',
      active: true,
    });
  };

  const handleSaveEmployee = async () => {
    try {
      if (editingEmployee) {
        // Atualizar funcionário existente
        const updateData = {
          name: employeeForm.name,
          email: employeeForm.email,
          role_id: employeeForm.role_id,
          active: employeeForm.active,
        };
        if (employeeForm.password) {
          updateData.password = employeeForm.password;
        }
        await api.put(`/auth/users/${editingEmployee.id}`, updateData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // Criar novo funcionário
        if (!employeeForm.password) {
          setError('Senha é obrigatória para novos funcionários');
          return;
        }
        await api.post('/auth/register', employeeForm);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
      handleCloseEmployeeDialog();
      loadEmployees();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      setError(error.response?.data?.error || 'Erro ao salvar funcionário');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;
    
    try {
      await api.delete(`/auth/users/${employeeId}`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadEmployees();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      setError('Erro ao excluir funcionário');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSaveLibrarySettings = () => {
    // Implementar salvamento
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    // Implementar mudança de senha
    setSuccess(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Configurações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerenciar configurações do sistema
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Operação realizada com sucesso!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="scrollable" scrollButtons="auto">
          <Tab label="Funcionários" />
          <Tab label="Biblioteca" />
          <Tab label="Minha Conta" />
        </Tabs>
      </Paper>

      {/* Aba de Funcionários */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Funcionários do Sistema
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd sx={{ display: { xs: 'none', sm: 'block' } }} />}
              onClick={() => handleOpenEmployeeDialog()}
              size="small"
            >
              Adicionar
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                  <TableCell>Perfil</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhum funcionário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          {employee.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {employee.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.role_name || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.active ? 'Ativo' : 'Inativo'}
                          size="small"
                          color={employee.active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEmployeeDialog(employee)}
                          disabled={employee.id === user?.id}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          disabled={employee.id === user?.id}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Aba de Configurações da Biblioteca */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Configurações da Biblioteca */}
          <Grid item xs={12}>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Configurações da Biblioteca
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prazo de Empréstimo (dias)"
                    type="number"
                    value={librarySettings.lendingDays}
                    onChange={(e) =>
                      setLibrarySettings({ ...librarySettings, lendingDays: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prazo de Renovação (dias)"
                    type="number"
                    value={librarySettings.renewalDays}
                    onChange={(e) =>
                      setLibrarySettings({ ...librarySettings, renewalDays: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Máximo de Renovações"
                    type="number"
                    value={librarySettings.maxRenewals}
                    onChange={(e) =>
                      setLibrarySettings({ ...librarySettings, maxRenewals: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Multa por Dia (R$)"
                    type="number"
                    value={librarySettings.finePerDay}
                    onChange={(e) =>
                      setLibrarySettings({ ...librarySettings, finePerDay: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Máximo de Empréstimos Ativos"
                    type="number"
                    value={librarySettings.maxActiveLendings}
                    onChange={(e) =>
                      setLibrarySettings({ ...librarySettings, maxActiveLendings: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={librarySettings.enableFines}
                        onChange={(e) =>
                          setLibrarySettings({ ...librarySettings, enableFines: e.target.checked })
                        }
                      />
                    }
                    label="Habilitar multas por atraso"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={librarySettings.enableReservations}
                        onChange={(e) =>
                          setLibrarySettings({
                            ...librarySettings,
                            enableReservations: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Habilitar reservas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveLibrarySettings}
                  >
                    Salvar Configurações
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Aba de Minha Conta */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Alterar Senha */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Alterar Senha
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Senha Atual"
                  type="password"
                  size="small"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Nova Senha"
                  type="password"
                  size="small"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  type="password"
                  size="small"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={handleChangePassword}
                >
                  Alterar Senha
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Informações do Usuário */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Meu Perfil
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Nome
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Perfil
                </Typography>
                <Chip label={user?.role} color="primary" size="small" sx={{ mt: 0.5 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Dialog de Adicionar/Editar Funcionário */}
      <Dialog open={openEmployeeDialog} onClose={handleCloseEmployeeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                size="small"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingEmployee ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                type="password"
                size="small"
                value={employeeForm.password}
                onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                helperText={editingEmployee ? 'Preencha apenas se quiser alterar a senha' : 'Obrigatório'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Perfil"
                size="small"
                value={employeeForm.role_id}
                onChange={(e) => setEmployeeForm({ ...employeeForm, role_id: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={employeeForm.active}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, active: e.target.checked })}
                  />
                }
                label="Ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmployeeDialog}>Cancelar</Button>
          <Button onClick={handleSaveEmployee} variant="contained">
            {editingEmployee ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
