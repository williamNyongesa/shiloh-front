import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, Skeleton } from "@mui/material";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await axios.get("https://shiloh-server.onrender.com//enrollments/courses"); // API endpoint
        console.log("API Response:", response.data); // Debug: Log the response
        const coursesData = Array.isArray(response.data.courses) ? response.data.courses : []; // Access the `courses` property
        setCourses(coursesData); // Update courses state
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Fallback to an empty array in case of error
      } finally {
        setLoading(false); // Set loading to false after fetching or error
      }
    };

    fetchCourses(); // Fetch courses on component mount
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 4,
          color: "primary.main",
        }}
      >
        Available Courses
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: 2,
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                maxWidth: 300,
                flex: "1 1 200px",
              }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={30} />
                  <Skeleton variant="text" width="60%" height={20} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : courses.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: 2,
          }}
        >
          {courses.map((course, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                maxWidth: 300,
                flex: "1 1 200px",
              }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: "bold",
                      color: "secondary.main",
                    }}
                  >
                    {course}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mt: 4,
          }}
        >
          No courses available.
        </Typography>
      )}
    </Container>
  );
};

export default Courses;
