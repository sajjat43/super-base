import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, ThemeProvider, createTheme, CssBaseline, Button, Container, Alert } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import { supabase } from './supabaseClient';
import { authService } from './services/authService';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleLogout = async () => {
    try {
      const { error } = await authService.logout();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Authentication App
              </Typography>
              {session && (
                <Button color="inherit" onClick={handleLogout} sx={{ mr: 2 }}>
                  Logout
                </Button>
              )}
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Routes>
            <Route 
              path="/reset-password" 
              element={
                !session ? (
                  <ResetPassword />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route
              path="/"
              element={
                !session ? (
                  showLogin ? (
                    <Login onSwitchToRegister={handleSwitchToRegister} />
                  ) : (
                    <Register onSwitchToLogin={handleSwitchToLogin} />
                  )
                ) : (
                  <Container sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                      Welcome, {session.user.email}!
                    </Typography>
                    <Typography variant="body1">
                      You are now logged in.
                    </Typography>
                  </Container>
                )
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
