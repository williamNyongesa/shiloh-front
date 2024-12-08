import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import "./enrollment.css"; // Ensure that you also apply any custom CSS for additional styling if needed

const Enrollment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: "",
    phoneNumber: "",
    selectedCourses: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to display in Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity of the Snackbar (success or error)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/enrollments/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched courses:", data);
        setCourses(data.courses || []);
        setLoading(false); // Stop loading after fetching courses
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const bodyData = JSON.stringify({
        phone_number: formData.phoneNumber,
        courses: formData.selectedCourses,
        student_id: formData.studentId,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: bodyData,
        redirect: "follow",
      };

      // Use async/await for the fetch request
      const response = await fetch("http://127.0.0.1:5000/enrollments", requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Enrollment success:", result);

      // Reset form data after successful enrollment
      setFormData({
        studentId: "",
        phoneNumber: "",
        selectedCourses: [],
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
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
          bgcolor: "white",
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
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
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
              selectedCourses: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
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
