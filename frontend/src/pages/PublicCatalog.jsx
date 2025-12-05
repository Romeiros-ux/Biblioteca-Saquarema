import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Login as LoginIcon,
  MenuBook as BookIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PublicCatalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const response = await api.get('/catalog/public/search', {
        params: { q: searchTerm }
      });
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const loadFeaturedBooks = async () => {
    try {
      const response = await api.get('/catalog/public/featured');
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar livros em destaque:', error);
    }
  };

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header Público */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <BookIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Biblioteca de Saquarema
          </Typography>
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            variant="outlined"
            sx={{ 
              borderColor: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section com Busca */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Catálogo Bibliográfico
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Pesquise entre nossos livros disponíveis
          </Typography>

          {/* Barra de Busca */}
          <Paper
            elevation={3}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Pesquisar por título, autor, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { px: 2, fontSize: '1.1rem' }
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              sx={{ 
                minWidth: 120,
                height: 48,
                borderRadius: 1.5,
              }}
            >
              Buscar
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Resultados */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {!searched && (
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📚 Livros em Destaque
          </Typography>
        )}

        {searched && (
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {books.length > 0 
              ? `${books.length} resultado(s) encontrado(s)`
              : 'Nenhum resultado encontrado'
            }
          </Typography>
        )}

        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <BookIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                        {book.title}
                      </Typography>
                      {book.subtitle && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {book.subtitle}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {book.author && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                    </Box>
                  )}

                  {book.publisher && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Editora:</strong> {book.publisher}
                    </Typography>
                  )}

                  {book.publication_year && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Ano:</strong> {book.publication_year}
                    </Typography>
                  )}

                  {book.isbn && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>ISBN:</strong> {book.isbn}
                    </Typography>
                  )}

                  {book.call_number && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Classificação:</strong> {book.call_number}
                    </Typography>
                  )}

                  {/* Status de Disponibilidade */}
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={book.available_copies > 0 
                        ? `${book.available_copies} disponível(is)`
                        : 'Indisponível'
                      }
                      color={book.available_copies > 0 ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {books.length === 0 && searched && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BookIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum livro encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente buscar por outro termo
            </Typography>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Biblioteca de Saquarema
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Sistema de gestão bibliográfica
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Button
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{ mt: 1 }}
              >
                Acesso Restrito (Bibliotecários)
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicCatalog;
