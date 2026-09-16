import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Snackbar, 
  Alert 
} from "@mui/material";
import { useDropzone } from 'react-dropzone';
import "./enrollment.css";
import { useNavigate } from "react-router-dom";

const Enrollment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState(""); // State for file validation error

  let userData = {};
  try {
    userData = JSON.parse(localStorage.getItem("userDATA")) || {};
  } catch (error) {
    console.error("Error parsing userDATA from localStorage:", error);
  }
  const studentId = userData.student?.id || "";

  const [formData, setFormData] = useState({
    studentId: studentId,
    email: "",
    phoneNumber: "",
    selectedCourses: [],
    documents: [],
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`https://shiloh-server-2t51.onrender.com/enrollments/courses`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    setFileError(""); // Clear file error on new file selection
    const allowedExtensions = /\.(pdf|doc|docx|jpg|jpeg|png)$/i;

    const invalidFiles = acceptedFiles.filter((file) => !allowedExtensions.test(file.name));
    if (invalidFiles.length > 0) {
      setFileError("Invalid file types. Allowed: .pdf, .doc, .docx, .jpg, .jpeg, .png.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      documents: acceptedFiles,
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.documents.length === 0) {
      setFileError("Please upload at least one document before submitting.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('phone_number', formData.phoneNumber);
    formDataToSubmit.append('student_id', formData.studentId);
    formDataToSubmit.append('email', formData.email || "");
    formDataToSubmit.append('courses', formData.selectedCourses);
    formData.documents.forEach((file) => {
      formDataToSubmit.append('document_file', file);
    });

    try {
      const response = await fetch(`https://shiloh-server-2t51.onrender.com/enrollments`, {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        
      }

      const result = await response.json();
      console.log("Enrollment success:", result);
      
      setFormData({
        studentId: studentId,
        email: "",
        phoneNumber: "",
        selectedCourses: [],
        documents: [],
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Course registered successfully!");
      setSnackbarOpen(true);
      navigate("/student");
    } catch (error) {
      console.error("Error submitting form data:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Course registration unsuccessful. Please try again.");
      setSnackbarOpen(true);
    }
  };

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
        bgcolor: "background.default",
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
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

        <Box
          sx={{
            border: `2px dashed`,
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
          {fileError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {fileError}
            </Typography>
          )}
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
