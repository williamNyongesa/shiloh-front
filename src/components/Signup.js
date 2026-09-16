import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, CircularProgress, Box, Typography, Paper } from '@mui/material';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.BASE_URL;

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',  // Keep confirmPassword for validation
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')  // Ensure confirmPassword matches password
        .required('Required'),
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...dataToSubmit } = values; // Remove confirmPassword before sending to backend

      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`https://shiloh-server-2t51.onrender.com/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit), // Send only username, email, and password to backend
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Network response was not ok');
          return;
        }

        const data = await response.json();
        console.log('Success:', data);
        navigate('/login');
      } catch (error) {
        setErrorMessage('Error: Unable to connect to the server');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box className="auth-page">
      <Paper
        className="auth-card"
      >
        <Typography className="eyebrow">START YOUR PATH</Typography>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
          Sign Up
        </Typography>

        {errorMessage && (
          <Box sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
            <Typography variant="body2">{errorMessage}</Typography>
          </Box>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            id="username"
            name="username"
            type="text"
            variant="outlined"
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            fullWidth
            label="Email"
            id="email"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            id="password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            variant="outlined"
            margin="normal"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;
