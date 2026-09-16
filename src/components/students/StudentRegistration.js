import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "notistack";
import { Box, Button, Container, TextField, Typography, Select, MenuItem, InputLabel, FormControl, useTheme } from "@mui/material";

export const StudentRegistration = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const theme = useTheme(); // Access theme for dynamic styling

    const formik = useFormik({
        initialValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            phone_number: "", 
            country_name: "",
            password: "", 
            confirm_password: "", // New field for password confirmation
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone_number: Yup.string()
                        .matches(/^[0-9]{10,15}$/, 'Phone number must be between 10 and 15 digits')
                        .required('Phone Number is required.'),
            country_name: Yup.string()
                            .notOneOf(["select"], 'Please select a country')
                            .required('Country is required.'),
            password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
            confirm_password: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const { confirm_password, ...submissionData } = values; // Remove confirm_password from the data to send

                const response = await fetch(`https://shiloh-server-2t51.onrender.com/students`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submissionData), // Send the form data excluding the confirm_password
                });
                console.log(response);

                if (response.ok) {
                    enqueueSnackbar('Registration successful!', { variant: 'success' });
                    navigate("/login");
                } else {
                    const errorData = await response.json();
                    enqueueSnackbar(errorData.message || 'Registration failed', { variant: 'error' });
                }
            } catch (error) {
                enqueueSnackbar('An error occurred. Please try again later.', { variant: 'error' });
            }
            finally {
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
                backgroundColor: theme.palette.background.default, // Theme-based background color
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 3,
                        backgroundColor: theme.palette.background.paper, // Form background adapts to the theme
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h5" sx={{ marginBottom: 3, color: theme.palette.text.primary }}>
                        Student Registration
                    </Typography>

                    <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            type="text"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                            helperText={formik.touched.first_name && formik.errors.first_name}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper, // Input background matches form
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary, // Text color
                                    borderColor: theme.palette.divider, // Border color based on theme
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            id="middle_name"
                            name="middle_name"
                            label="Middle Name"
                            type="text"
                            value={formik.values.middle_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.middle_name && Boolean(formik.errors.middle_name)}
                            helperText={formik.touched.middle_name && formik.errors.middle_name}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            id="last_name"
                            name="last_name"
                            label="Last Name"
                            type="text"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                            helperText={formik.touched.last_name && formik.errors.last_name}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            id="phone_number"
                            name="phone_number"
                            label="Phone Number"
                            type="text"
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                            helperText={formik.touched.phone_number && formik.errors.phone_number}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="country_name" sx={{ color: theme.palette.text.primary }}>Country</InputLabel>
                            <Select
                                labelId="country_name"
                                id="country_name"
                                name="country_name"
                                value={formik.values.country_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.country_name && Boolean(formik.errors.country_name)}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                }}
                            >
                                <MenuItem value="select">Select Country</MenuItem>
                                <MenuItem value="Kenya">Kenya</MenuItem>
                                <MenuItem value="United States">USA</MenuItem>
                                <MenuItem value="India">India</MenuItem>
                                <MenuItem value="Canada">Canada</MenuItem>
                                <MenuItem value="United Kingdom">UK</MenuItem>
                                <MenuItem value="Australia">Australia</MenuItem>
                                <MenuItem value="Germany">Germany</MenuItem>
                                <MenuItem value="France">France</MenuItem>
                                <MenuItem value="South Africa">South Africa</MenuItem>
                            </Select>
                            {formik.touched.country_name && formik.errors.country_name && (
                                <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                                    {formik.errors.country_name}
                                </Typography>
                            )}
                        </FormControl>

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            id="confirm_password"
                            name="confirm_password"
                            label="Confirm Password"
                            type="password"
                            value={formik.values.confirm_password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                            margin="normal"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiInputBase-root': {
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ marginTop: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};
