import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "notistack";
import { AuthContext } from "../context/AuthContext";

export const StudentRegistration = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone_number: "", // Ensure this matches the name attribute
            country_name: "", // Ensure this matches the name attribute
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
                const response = await fetch("http://127.0.0.1:5000/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    const data = await response.json();
                    setAuth({ user: data, role: "student" });
                    enqueueSnackbar('Registration successful!', { variant: 'success' });
                    navigate("/enrollment");
                } else {
                    const errorData = await response.json();
                    enqueueSnackbar(errorData.message || 'Registration failed', { variant: 'error' });
                    console.log("Response status:", response.status); // Log response status for further investigation
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form 
                onSubmit={formik.handleSubmit} 
                className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Student Registration</h2>

                <div>
                    <label
                        htmlFor="name"
                        className="block mb-1 text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.name && formik.errors.name
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="mt-1 text-sm text-red-500">
                            {formik.errors.name}
                        </div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block mb-1 text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.email && formik.errors.email
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="mt-1 text-sm text-red-500">
                            {formik.errors.email}
                        </div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phone_number"
                        className="block mb-1 text-sm font-medium text-gray-700"
                    >
                        Phone Number:
                    </label>
                    <input
                        id="phone_number"
                        type="text"
                        name="phone_number" 
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.phone_number && formik.errors.phone_number
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}    
                    />
                    {formik.touched.phone_number && formik.errors.phone_number && (
                        <div className="mt-1 text-sm text-red-500">
                            {formik.errors.phone_number}
                        </div>
                    )}   
                </div>

                <div>
                    <label
                        htmlFor="country_name"
                        className="block mb-1 text-sm font-medium text-gray-700"
                    >
                        Country:
                    </label>
                    <select
                        id="country_name"
                        name="country_name"
                        value={formik.values.country_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.country_name && formik.errors.country_name
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                    >
                        <option value="select">Select Country</option>
                        <option value="Kenya">Kenya</option>
                        <option value="United States">USA</option>
                        <option value="India">India</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">UK</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="South Africa">South Africa</option>
                    </select>
                    {formik.touched.country_name && formik.errors.country_name && (
                        <div className="mt-1 text-sm text-red-500">
                            {formik.errors.country_name}
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};
