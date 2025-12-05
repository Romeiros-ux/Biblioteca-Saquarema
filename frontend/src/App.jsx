import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import PublicCatalog from './pages/PublicCatalog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Circulation from './pages/Circulation';
import Users from './pages/Users';
import ImportBooks from './pages/ImportBooks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<PublicCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                  <Navbar onMenuClick={handleDrawerToggle} />
                  <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      p: { xs: 2, sm: 3 },
                      width: '100%',
                      maxWidth: { sm: `calc(100% - 240px)` },
                      marginLeft: { xs: 0, sm: '240px' },
                      minHeight: '100vh',
                      bgcolor: '#f5f5f5',
                      transition: 'margin 0.3s ease',
                    }}
                  >
                    <Toolbar />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/catalog" element={<Catalog />} />
                      <Route path="/circulation" element={<Circulation />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/import" element={<ImportBooks />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Box>
                </Box>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
