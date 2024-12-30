import {
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Skeleton, Divider,Avatar,Grid,Card,List,ListItem,ListItemText, Container } from "@mui/material";
import { Dashboard as DashboardIcon, Assignment as AssignmentIcon, School as SchoolIcon, Star as StarIcon } from "@mui/icons-material";
import { GrAchievement } from "react-icons/gr";
import { FaAward } from "react-icons/fa";
import axios from "axios";

let renderStats = null;
let renderCourses = null;

// Sample stats for the teacher dashboard
const stats = [
  { label: "Courses Taught", count: 12, icon: <SchoolIcon /> },
  { label: "Assignments Graded", count: 50, icon: <AssignmentIcon /> },
  { label: "Awards Received", count: 3, icon: <StarIcon /> },
];

const TeacherDashboardOverview = () => {
  const [courses, setCourses] = useState([]);  // State to hold the fetched courses
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const baseUrl = process.env.BASE_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);  // Set loading to true when fetching starts
        const response = await axios.get("https://shiloh-server.onrender.com/enrollments/courses"); // Replace with your actual API endpoint
        // Ensure courses is always an array
        const coursesData = Array.isArray(response.data.courses) ? response.data.courses : [];
        setCourses(coursesData);  // Update the state with the fetched courses
        setLoading(false);  // Set loading to false once the data is fetched
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);  // Set empty array in case of error
        setLoading(false);  // Set loading to false after error
      }
    };

    fetchCourses();  // Call fetchCourses when the component mounts
  }, []); 

  // Render Courses UI for Teachers
  renderCourses = () => (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: 1, pb: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Courses Taught</Typography>
          <Button sx={{ color: "primary.main" }}>View All</Button>
        </Box>
        {loading ? (
          // Show skeleton loaders if data is loading
          [...Array(3)].map((_, index) => (
            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Skeleton width="200px" height={30} />
                <Skeleton width="150px" height={20} />
                <Skeleton width="100%" height={6} sx={{ mt: 1 }} />
              </Box>
              <Button sx={{ color: "primary.main" }}>Continue</Button>
            </Box>
          ))
        ) : (
          // Render actual courses after loading
          courses.length > 0 ? (
            courses.map((course, index) => (
              <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexDirection: "column" }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }} color="secondary">{course}</Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>Progress: {Math.floor(Math.random() * 100)}%</Typography>
                  <Box sx={{ width: "100%", height: 6, backgroundColor: "#e0e0e0", mt: 1 }}>
                    <Box sx={{ width: `${Math.random() * 100}}%`, height: "100%", backgroundColor: "#388e3c" }} />
                  </Box>
                </Box>
                <Button sx={{ color: "primary.main" }}>Continue</Button>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "gray" }}>No courses available</Typography>
          )
        )}
      </Paper>
    </Box>
  );

  // Render stats UI for Teachers
  renderStats = () => (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", md: "row" } }}>
      {stats.map((stat, index) => (
        <Box key={index} sx={{ width: { xs: "100%", sm: "33%" }, padding: 3 }}>
          <Paper sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: 3 }}>
            {stat.icon}
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>{loading ? <Skeleton width={50} /> : stat.count}</Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>{stat.label}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
  
  // Render rewards and certificates UI for Teachers
  const renderRewardAndCertificates = () => (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
      {["Reward", "Certificates"].map((item, index) => (
        <Box key={index} sx={{ width: { xs: "100%", sm: "50%" }, padding: 3 }}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {item === "Reward" ? <GrAchievement sx={{ marginRight: 1 }} /> : <FaAward sx={{ marginRight: 1 }} />}
              {item}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: loading ? "#e0e0e0" : "#388e3c",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StarIcon />
                </Box>
              ))}
            </Box>
            <Button sx={{ mt: 2 }} color="primary">View All</Button>
          </Paper>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      {renderStats()}
      {renderRewardAndCertificates()}
      {renderCourses()}
    </>
  );
};


const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch teacher data
    axios
    .get("/api/teacher-dashboard")
    .then((response) => {
      setTeacher(response.data.teacher);
      setLoading(false);
    })
      .catch((error) => {
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      });
    }, []);
    
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!teacher) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Failed to load teacher data.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80 }}>
              <SchoolIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4" fontWeight="bold">
              {teacher.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Subject: {teacher.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hired on: {new Date(teacher.hire_date).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Enrollments
        </Typography>
        {teacher.enrollments.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No enrollments found.
          </Typography>
        ) : (
          <Card sx={{ p: 2, boxShadow: 2 }}>
            <List>
              {teacher.enrollments.map((enrollment, index) => (
                <React.Fragment key={enrollment.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Student: ${enrollment.student_name}`}
                      secondary={`Enrolled on: ${new Date(enrollment.enrollment_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < teacher.enrollments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        )}
      </Box>
    </Container>
  );
};


const TeacherDash = () => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    // Fetch teacher data from localStorage
    const teacherData = localStorage.getItem("userDATA");

    if (teacherData) {
      try {
        const parsedData = JSON.parse(teacherData);
        setTeacher({
          ...parsedData.teacher,
          enrollments: parsedData.teacher.enrollments || [],
        });
      } catch (error) {
        console.error("Error parsing teacher data:", error);
      }
    }
  }, []);

  if (!teacher) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, mr: 2 }}>
            <SchoolIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {teacher.name || "No Name"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Subject: {teacher.subject || "No Subject"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hired on:{" "}
              {teacher.hire_date
                ? new Date(teacher.hire_date).toLocaleDateString()
                : "No Hire Date"}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Enrollments
        </Typography>
        {teacher.enrollments?.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No enrollments found.
          </Typography>
        ) : (
          <Card sx={{ p: 2, boxShadow: 2 }}>
            <List>
              {teacher.enrollments.map((enrollment, index) => (
                <React.Fragment key={enrollment.id || index}>
                  <ListItem>
                    <ListItemText
                      primary={`Student: ${enrollment.student_name || "Unknown"}`}
                      secondary={`Enrolled on: ${
                        enrollment.enrollment_date
                          ? new Date(enrollment.enrollment_date).toLocaleDateString()
                          : "Unknown Date"
                      }`}
                    />
                  </ListItem>
                  {index < teacher.enrollments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export {renderCourses,renderStats,TeacherDash};

export default TeacherDashboard;