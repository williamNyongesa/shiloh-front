  import React, { useState } from 'react';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { useNavigate } from 'react-router-dom';
  import { Button, TextField, CircularProgress, Box, Typography, Paper, MenuItem } from '@mui/material';

  const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const baseUrl = process.env.BASE_URL;


    const formik = useFormik({
      initialValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      },
      validationSchema: Yup.object({
        username: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string()
          .required('Required')
          .min(8, 'Password must be at least 8 characters'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required'),
        // role: Yup.string().required('Role is required'),
      }),
      onSubmit: async (values) => {
        setLoading(true);
        setErrorMessage(null);

        try {
          const response = await fetch(`http://localhost:5000/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f0f4f8',
          padding: 2, 
        }}
      >
        <Paper
          sx={{
            padding: 4,
            width: '100%',
            maxWidth: 480,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
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

            {/* Role Selection Dropdown */}
            {/* <TextField
              fullWidth
              select
              label="Role"
              id="role"
              name="role"
              variant="outlined"
              margin="normal"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="">Select a role</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </TextField> */}

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
