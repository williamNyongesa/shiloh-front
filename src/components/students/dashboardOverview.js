import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Skeleton } from "@mui/material";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Star as StarIcon } from "@mui/icons-material";
import { GrAchievement } from "react-icons/gr";
import { FaAward } from "react-icons/fa";
import axios from "axios";  // Use axios to fetch data

let renderStats = null;
let renderCourses = null;

// Sample stats for the dashboard
const stats = [
  { label: "Courses To Do", count: 29, icon: <DashboardIcon /> },
  { label: "Overdue Courses", count: 6, icon: <ExitToAppIcon /> },
  { label: "Completed Courses", count: 1, icon: <StarIcon /> },
];

const StudentdashboardOverview = () => {
  const [courses, setCourses] = useState([]);  // State to hold the fetched courses
  const [loading, setLoading] = useState(true);  // State to manage loading state

  // Fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/enrollments"); // Replace with your actual API endpoint
      setCourses(response.data); // Assuming the data is in response.data
      setLoading(false);  // Data is loaded, set loading to false
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);  // Stop loading in case of an error
    }
  };

  useEffect(() => {
    fetchCourses(); // Call the function to fetch courses on component mount
  }, []);

  // Render Courses UI
  renderCourses = () => (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: 1, pb: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Courses</Typography>
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
          courses.map((course, index) => (
            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{course.title}</Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>Lorem ipsum is simply dummy text.</Typography>
                <Box sx={{ width: "100%", height: 6, backgroundColor: "#e0e0e0", mt: 1 }}>
                  <Box sx={{ width: `${course.progress}%`, height: "100%", backgroundColor: "#388e3c" }} />
                </Box>
              </Box>
              <Button sx={{ color: "primary.main" }}>Continue</Button>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );

  // Render stats UI
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

  // Render rewards and certificates UI
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

export { renderStats, renderCourses };
export default StudentdashboardOverview;
