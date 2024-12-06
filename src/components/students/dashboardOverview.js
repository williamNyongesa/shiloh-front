import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Skeleton } from "@mui/material";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Star as StarIcon } from "@mui/icons-material";
import { GrAchievement } from "react-icons/gr";
import { FaAward } from "react-icons/fa";
let renderStats = null;
let renderCourses = null;

const stats = [
{ label: "Courses To Do", count: 29, icon: <DashboardIcon /> },
{ label: "Overdue Courses", count: 6, icon: <ExitToAppIcon /> },
{ label: "Completed Courses", count: 1, icon: <StarIcon /> },
];

const courses = [
{ title: "Basics of HTML", progress: 13 },
{ title: "Angular in Steps", progress: 73 },
{ title: "Bootstrap Foundation", progress: 60 },
];
// Function to fetch enrollments from the server
async function fetchEnrollments() {
    const url = '/api/enrollments';  // Replace with the actual URL of your API endpoint

    try {
        // Make a GET request to the enrollments endpoint
        const response = await fetch(url, {
            method: 'GET',  // HTTP method
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response status is OK (status code 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Handle the fetched data (e.g., display it on the page)
        console.log('Enrollments fetched successfully:', data);

        // You can also return the data if needed elsewhere in your application
        return data;

    } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error('Error fetching enrollments:', error);
        alert('There was an error fetching the enrollments. Please try again later.');
    }
}

const fetchedCourses = fetchEnrollments();
console.log(fetchedCourses)
const StudentdashboardOverview = ()=>{
    const [loading, setLoading] = useState(true);
  // Simulate a loading time (e.g., fetching data)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
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
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}>
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

  renderCourses = () => (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: 1, pb: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Courses</Typography>
          <Button sx={{ color: "primary.main" }}>View All</Button>
        </Box>
        {courses.map((course, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{loading ? <Skeleton width="200px" /> : course.title}</Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>{loading ? <Skeleton width="150px" /> : "Lorem ipsum is simply dummy text."}</Typography>
              <Box sx={{ width: "100%", height: 6, backgroundColor: "#e0e0e0", mt: 1 }}>
                <Box sx={{ width: `${loading ? 0 : course.progress}%`, height: "100%", backgroundColor: "#388e3c" }} />
              </Box>
            </Box>
            <Button sx={{ color: "primary.main" }}>Continue</Button>
          </Box>
        ))}
      </Paper>
    </Box>
  );


    return (
        <>
        {renderStats()}
        {renderRewardAndCertificates()}
        {renderCourses()}
        </>
    )
  }
  export {renderStats,renderCourses}
  export default StudentdashboardOverview;
