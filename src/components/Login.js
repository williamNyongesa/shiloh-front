import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, CircularProgress, Divider, Stack } from '@mui/material';
import axios from 'axios';
import { useAuth } from './context/AuthContext.js';
import { getDemoUser } from '../demoData';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);  // State for loading
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoLogin = (role) => {
    const demoUser = getDemoUser(role);
    localStorage.setItem('userDATA', JSON.stringify(demoUser));
    login(demoUser.access_token, demoUser.refresh_token, demoUser);
    navigate(`/${role}`);
  };
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);  // Set loading to true when submitting
      try {
        const response = await axios.post(`https://shiloh-server-2t51.onrender.com/users/login`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { access_token, username, email, role, refresh_token } = response.data;
          localStorage.setItem('userDATA', JSON.stringify(response.data))

          if (access_token && username && email && role && refresh_token) {
            login(access_token, refresh_token, { username, role, email });
            if (role === 'student') navigate('/enrollment');
            if (role === 'admin') navigate('/admin');
            if (role === 'user') navigate('/home');
          } else {
            setErrorMessage('Invalid login data received.');
          }
        }
      } catch (error) {
        const errorMsg = error.response
          ? error.response.data.error || 'Error during login. Please try again.'
          : 'Network error. Please try again later.';

        setErrorMessage(errorMsg);
        console.error('Login failed:', errorMsg);
      } finally {
        setLoading(false);  // Set loading to false once the request is finished
      }
    },
  });

  return (
    <Box className="auth-page">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        className="auth-card"
      >
        <Typography className="eyebrow">WELCOME BACK</Typography>
        <Typography 
          variant="h4" 
          gutterBottom
          color="primary"
        >
          Login
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          name="email"
          variant="outlined"
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          color="secondary"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          margin="normal"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          color="secondary"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Login'
          )}
        </Button>
        <Divider sx={{ my: 3 }}>or</Divider>
        <Stack spacing={1.25}>
          <Button fullWidth variant="outlined" color="secondary" type="button" onClick={() => handleDemoLogin('student')}>Try student demo</Button>
          <Button fullWidth variant="outlined" color="primary" type="button" onClick={() => handleDemoLogin('teacher')}>Try teacher demo</Button>
          <Button fullWidth variant="outlined" type="button" onClick={() => handleDemoLogin('admin')}>Try admin demo</Button>
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 1.5 }}>
          Uses sample data locally. No account or API request required.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
