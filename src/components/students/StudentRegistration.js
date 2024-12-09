import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "notistack";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Container, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

export const StudentRegistration = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false)
    const baseUrl = process.env.BASE_URL;


    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone_number: "", 
            country_name: "", 
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Student name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone_number: Yup.string()
                        .matches(/^[0-9]{10,15}$/, 'Phone number must be between 10 and 15 digits')
                        .required('Phone Number is required.'),
            country_name: Yup.string()
                            .notOneOf(["select"], 'Please select a country')
                            .required('Country is required.')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await fetch(`https://shiloh-server.onrender.com/students`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });
                console.log(values)

                if (response.ok) {
                    const data = await response.json();
                    setAuth({ user: data, role: "student" });
                    enqueueSnackbar('Registration successful!', { variant: 'success' });
                    navigate("/enrollment");
                } else {
                    const errorData = await response.json();
                    enqueueSnackbar(errorData.message || 'Registration failed', { variant: 'error' });
                    console.log("Response status:", response.status);
                }
            } catch (error) {
                console.error("Registration failed:", error.message);
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
                backgroundColor: 'background.default'
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h5" sx={{ marginBottom: 3 }}>
                        Student Registration
                    </Typography>

                    <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            margin="normal"
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
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="country_name">Country</InputLabel>
                            <Select
                                labelId="country_name"
                                id="country_name"
                                name="country_name"
                                value={formik.values.country_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.country_name && Boolean(formik.errors.country_name)}
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
