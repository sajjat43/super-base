import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, ThemeProvider, createTheme, CssBaseline, Button, Container, Alert } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Login from './components/Login';
import Register from './components/Register';
import { supabase } from './supabaseClient';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);

        // Listen for auth changes
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

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
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
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!session ? (
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
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
