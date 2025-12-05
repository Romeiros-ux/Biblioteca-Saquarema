import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { PictureAsPdf, TableChart, DateRange, TrendingUp } from '@mui/icons-material';

export default function Reports() {
  const [reportType, setReportType] = useState('lendings');
  const [period, setPeriod] = useState('month');

  const reports = [
    {
      id: 1,
      title: 'Empréstimos',
      description: 'Relatório de empréstimos por período',
      icon: <TableChart color="primary" />,
      type: 'lendings',
    },
    {
      id: 2,
      title: 'Usuários',
      description: 'Relatório de usuários cadastrados',
      icon: <TableChart color="success" />,
      type: 'users',
    },
    {
      id: 3,
      title: 'Acervo',
      description: 'Relatório do acervo bibliográfico',
      icon: <TableChart color="info" />,
      type: 'catalog',
    },
    {
      id: 4,
      title: 'Estatísticas',
      description: 'Estatísticas gerais do sistema',
      icon: <TrendingUp color="warning" />,
      type: 'statistics',
    },
  ];

  const mockData = [
    { item: 'Dom Casmurro', quantity: 15, status: 'Ativo' },
    { item: 'O Cortiço', quantity: 12, status: 'Ativo' },
    { item: 'Clean Code', quantity: 8, status: 'Ativo' },
    { item: '1984', quantity: 10, status: 'Ativo' },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Relatórios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerar relatórios e estatísticas
        </Typography>
      </Box>

      {/* Cards de tipos de relatórios */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        {reports.map((report) => (
          <Grid item xs={6} sm={6} md={3} key={report.id}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                border: reportType === report.type ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onClick={() => setReportType(report.type)}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 1 }}>{report.icon}</Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 600 }}
                  >
                    {report.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.7rem' }}
                  >
                    {report.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Período</InputLabel>
              <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Período">
                <MenuItem value="today">Hoje</MenuItem>
                <MenuItem value="week">Esta Semana</MenuItem>
                <MenuItem value="month">Este Mês</MenuItem>
                <MenuItem value="year">Este Ano</MenuItem>
                <MenuItem value="custom">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<DateRange sx={{ display: { xs: 'none', sm: 'block' } }} />}
              sx={{ height: 40 }}
            >
              Gerar
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PictureAsPdf sx={{ display: { xs: 'none', sm: 'block' } }} />}
              sx={{ height: 40 }}
            >
              PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Estatísticas rápidas */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              245
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Total no Período
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              89
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Ativos
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              12
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Atrasados
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              144
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Devolvidos
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabela de dados */}
      <TableContainer component={Paper}>
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Dados do Relatório
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                Quantidade
              </TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.item}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                  >
                    Qtd: {row.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {row.quantity}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      display: 'inline-block',
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
