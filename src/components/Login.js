import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from './context/AuthContext.js';
import { login as userLogin } from '../api.js';
import { useTheme } from '@mui/material/styles'; // Import the useTheme hook

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const baseUrl = process.env.REACT_APP_BASE_URL;  // Correct access to environment variable
  const theme = useTheme(); // Access the current theme
  
  console.log('Base URL:', baseUrl);  // Log to ensure it is loaded

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`http://localhost:5000/users/login`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { access_token, username, email, role, refresh_token } = response.data;
          localStorage.setItem('userDATA',JSON.stringify(response.data))

          if (access_token && username && email && role && refresh_token) {
            login(access_token, refresh_token, { username, role, email });
            if (role === 'student') navigate('/enrollment');
            if (role === 'admin') navigate('/admin');
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
      }
    },
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        width="100%"
        maxWidth="400px"
        bgcolor="white"
        p={4}
        borderRadius={2}
        boxShadow={3}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          color={theme.palette.primary} // Adjust the color based on the theme
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
          label="Username"
          name="username"
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
          color={"secondary"}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
