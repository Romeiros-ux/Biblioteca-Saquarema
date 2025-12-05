import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Container } from '@mui/material';
import { MenuBook, People, LibraryBooks, TrendingUp } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box
          sx={{
            bgcolor: color,
            borderRadius: 2,
            p: { xs: 0.75, sm: 1 },
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography 
            color="text.secondary" 
            variant="caption" 
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão geral do sistema
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Total de Livros"
            value="1,234"
            icon={<MenuBook sx={{ color: 'white' }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Usuários Ativos"
            value="567"
            icon={<People sx={{ color: 'white' }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Empréstimos Ativos"
            value="89"
            icon={<LibraryBooks sx={{ color: 'white' }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Empréstimos (Mês)"
            value="234"
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 0.5, sm: 1 } }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Empréstimos Recentes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lista dos empréstimos mais recentes...
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Livros Mais Emprestados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ranking dos livros mais populares...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
