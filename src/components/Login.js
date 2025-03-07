import React, { useState } from 'react';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  Link 
} from '@mui/material';
import { authService } from '../services/authService';

function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await authService.login(
      formData.email,
      formData.password
    );

    if (error) {
      setError(error);
    } else {
      console.log('Login successful:', data);
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    const { error } = await authService.resetPassword(formData.email);
    
    if (error) {
      setError(error);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login 
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {resetSent && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset instructions have been sent to your email.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleForgotPassword}
            disabled={loading}
            sx={{ display: 'block', mb: 2 }}
          >
            Forgot Password?
          </Link>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button 
              color="primary" 
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              <AppRegistrationIcon sx={{ mr: 1 }} /> Register here 
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login; 