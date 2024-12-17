import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Snackbar, Alert, useTheme } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import "./enrollment.css";

const Enrollment = () => {
  const theme = useTheme();  // Access the MUI theme
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    phoneNumber: "",
    selectedCourses: [],
    documents: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`https://shiloh-server.onrender.com/enrollments/courses`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data.courses || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file selection via Dropzone
  const onDrop = (acceptedFiles) => {
    setFormData((prevData) => ({
      ...prevData,
      documents: acceptedFiles, // Store the selected files
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    multiple: true,
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();

    formDataToSubmit.append('phone_number', formData.phoneNumber);
    formDataToSubmit.append('student_id', formData.studentId);
    formDataToSubmit.append('email', formData.email || "");
    formDataToSubmit.append('courses', formData.selectedCourses);

    // Append documents to FormData object
    formData.documents.forEach((file) => {
      formDataToSubmit.append('document_file', file);
    });

    try {
      const response = await fetch(`https://shiloh-server.onrender.com/enrollments`, {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Enrollment success:", result);

      setFormData({
        studentId: "",
        email: "",
        phoneNumber: "",
        selectedCourses: [],
        documents: [],
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Course registered successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting form data:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Course registration unsuccessful. Please try again.");
      setSnackbarOpen(true);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default", // Theme-based background color
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper", // Theme-based paper background
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Student Enrollment Form
        </Typography>

        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email (Optional)"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Select Courses:
        </Typography>
        <select
          id="courses"
          name="selectedCourses"
          multiple
          value={formData.selectedCourses}
          onChange={(e) =>
            setFormData({
              ...formData,
              selectedCourses: Array.from(e.target.selectedOptions, (option) => option.value),
            })
          }
          required
          style={{
            width: "100%",
            height: "150px",
            padding: "8px",
            marginBottom: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {loading ? (
            <option value="">
              <CircularProgress />
              Loading courses...
            </option>
          ) : (
            courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))
          )}
        </select>

        {/* File upload section */}
        <Box
          sx={{
            border: `2px dashed ${theme.palette.divider}`, // Use theme-based border color
            padding: 2,
            borderRadius: 1,
            textAlign: "center",
            mb: 2,
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Typography variant="body1">
            Drag & drop documents here, or click to select files
          </Typography>
          {formData.documents.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                {formData.documents.map((file, index) => (
                  <Box key={index}>{file.name}</Box>
                ))}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Enroll
        </Button>
      </Box>

      {/* Snackbar for success/error message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Enrollment;
