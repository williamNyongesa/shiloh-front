import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, AppBar, Toolbar, Paper } from "@mui/material";
import Chart from "chart.js/auto";
import axios from "axios";

// Load userData from localStorage
const userData = JSON.parse(localStorage.getItem("userData"));

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your API base URL
  headers: {
    Authorization: `Bearer ${userData?.access_token}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Refresh token
        const refreshResponse = await axios.post("http://localhost:5000/users/refresh", {
          refresh_token: userData.refresh_token,
        });

        // Update token in localStorage and headers
        const updatedData = {
          ...userData,
          access_token: refreshResponse.data.access_token,
        };
        localStorage.setItem("userData", JSON.stringify(updatedData));
        axiosInstance.defaults.headers.Authorization = `Bearer ${updatedData.access_token}`;
        error.config.headers.Authorization = `Bearer ${updatedData.access_token}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("userData");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };

const Dashboard = () => {
  const [data, setData] = useState({});
  const chartRef = useRef(null); // Reference to the chart instance

  const fetchData = async () => {
    try {
      const attendanceReport = await axiosInstance.get("/attendance/report");
      const studentData = await axiosInstance.get("/students");
      setData({
        attendance: attendanceReport.data,
        students: studentData.data,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderChart = (canvasId, chartType, labels, data, backgroundColors) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      // Destroy the existing chart instance
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create a new chart instance
      chartRef.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  };

  useEffect(() => {
    if (data.attendance) {
      renderChart(
        "attendanceChart",
        "pie",
        ["Present", "Absent", "Late"],
        [
          data.attendance.present || 0,
          data.attendance.absent || 0,
          data.attendance.late || 0,
        ],
        ["#4caf50", "#f44336", "#ffc107"]
      );
    }
  }, [data]);

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }} color="inherit">
            School Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={3} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#333", fontWeight: "bold" }}
        >
          Overview
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
          justifyContent="center"
        >
          {/* Attendance Section */}
          <Box
            flex="1 1 300px"
            minWidth="300px"
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Paper sx={{ padding: 3, backgroundColor: "#ffffff" }}>
              <Typography variant="h6" sx={{ color: "#1976d2" }}>
                Attendance
              </Typography>
              <Box height="300px" width="100%">
                <canvas id="attendanceChart"></canvas>
              </Box>
            </Paper>
          </Box>

          {/* Student Statistics Section */}
          <Box
            flex="1 1 300px"
            minWidth="300px"
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Paper sx={{ padding: 3, backgroundColor: "#ffffff" }}>
              <Typography variant="h6" sx={{ color: "#1976d2" }}>
                Student Statistics
              </Typography>
              <Typography>Total Students: {data.students?.length || 0}</Typography>
            </Paper>
          </Box>

          {/* Placeholder Section */}
          <Box
            flex="1 1 300px"
            minWidth="300px"
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Paper sx={{ padding: 3, backgroundColor: "#ffffff" }}>
              <Typography variant="h6" sx={{ color: "#1976d2" }}>
                Placeholder for More Content
              </Typography>
              <Typography>More data can be added here.</Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
