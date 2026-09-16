import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, Avatar, Chip, LinearProgress, Stack } from "@mui/material";
import Chart from "chart.js/auto";
import axios from "axios";
import { getDemoUser } from "../../demoData";
import { ArrowUpward, Groups, Payments, School, TrendingUp, WarningAmber } from "@mui/icons-material";

// Load the active session from localStorage.
const getStoredUserData = () => JSON.parse(localStorage.getItem("userDATA") || "null");
const initialUserData = getStoredUserData();

const axiosInstance = axios.create({
  baseURL: "https://shiloh-server-2t51.onrender.com", // Replace with your API base URL
  baseURL: "https://shiloh-server-2t51.onrender.com", // Replace with your API base URL
  headers: {
    Authorization: `Bearer ${initialUserData?.access_token}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const storedData = getStoredUserData();
        if (!storedData?.refresh_token) {
          window.location.href = "/login";
          return Promise.reject(error);
        }
        // Refresh token
        const refreshResponse = await axios.post("https://shiloh-server-2t51.onrender.com/users/refresh", {
          refresh_token: storedData.refresh_token,
        });

        // Update token in localStorage and headers
        const updatedData = {
          ...storedData,
          access_token: refreshResponse.data.access_token,
        };
        console.log("Token refreshed:", updatedData);
        localStorage.setItem("userDATA", JSON.stringify(updatedData));
        axiosInstance.defaults.headers.Authorization = `Bearer ${updatedData.access_token}`;
        error.config.headers.Authorization = `Bearer ${updatedData.access_token}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("userDATA");
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
      const teacherData = await axiosInstance.get("/teachers");
      setData({
        attendance: attendanceReport.data,
        students: studentData.data,
        teachers: teacherData.data,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const storedData = getStoredUserData();
    if (storedData?.demo) {
      const demoAdmin = getDemoUser("admin");
      setData({
        attendance: demoAdmin.attendance,
        students: demoAdmin.students,
        teachers: demoAdmin.teachers,
      });
      return undefined;
    }
    fetchData();
    return () => chartRef.current?.destroy();
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
          data.attendance.present || 1,
          data.attendance.absent || 1,
          data.attendance.late || 1,
        ],
        ["#4caf50", "#f44336", "#ffc107"]
      );
    }
  }, [data]);

  const students = data.students || [];
  const teachers = data.teachers || [];
  const attendance = data.attendance || { present: 0, absent: 0, late: 0 };
  const transactions = getStoredUserData()?.demo ? getDemoUser("admin").transactions : [];
  const collected = transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const activeStudents = students.filter((student) => student.status !== "Pending").length;
  const attendanceRate = attendance.present || 0;
  const kpis = [
    { label: "Active learners", value: activeStudents, change: "+12.5%", icon: <Groups />, tone: "indigo" },
    { label: "Teaching staff", value: teachers.length, change: "+2 this term", icon: <School />, tone: "mint" },
    { label: "Attendance health", value: `${attendanceRate}%`, change: attendanceRate >= 80 ? "On track" : "Needs attention", icon: <TrendingUp />, tone: "coral" },
    { label: "Recent collections", value: `$${collected.toLocaleString()}`, change: "This month", icon: <Payments />, tone: "gold" },
  ];

  return (
    <Box className="admin-overview">
      <Box className="admin-welcome"><Box><Typography className="eyebrow">ACADEMIC OPERATIONS</Typography><Typography variant="h4" sx={{ mt: .5 }}>Good morning, Jordan</Typography><Typography color="text.secondary" sx={{ mt: .75 }}>Here is the health of your learning community today.</Typography></Box><Chip icon={<ArrowUpward />} label="12.5% learner growth" color="success" /></Box>
      <Box className="admin-kpi-grid">{kpis.map((kpi) => <Paper className={`admin-kpi-card ${kpi.tone}`} elevation={0} key={kpi.label}><Avatar variant="rounded">{kpi.icon}</Avatar><Box><Typography variant="h5">{kpi.value}</Typography><Typography variant="body2" color="text.secondary">{kpi.label}</Typography><Typography variant="caption" color="success.main">{kpi.change}</Typography></Box></Paper>)}</Box>
      <Box className="admin-main-grid">
        <Paper className="admin-panel admin-attendance-panel" elevation={0}><Box className="admin-panel-heading"><Box><Typography variant="h6">Attendance health</Typography><Typography variant="body2" color="text.secondary">A pulse check across the college</Typography></Box><Chip label={attendanceRate >= 80 ? "Healthy" : "Review needed"} color={attendanceRate >= 80 ? "success" : "warning"} size="small" /></Box><Box className="admin-chart-wrap"><canvas id="attendanceChart" /></Box><Box className="admin-attendance-legend"><Box><span className="legend-dot present" />Present <strong>{attendance.present}%</strong></Box><Box><span className="legend-dot late" />Late <strong>{attendance.late}%</strong></Box><Box><span className="legend-dot absent" />Absent <strong>{attendance.absent}%</strong></Box></Box></Paper>
        <Paper className="admin-panel" elevation={0}><Box className="admin-panel-heading"><Box><Typography variant="h6">Learner mix</Typography><Typography variant="body2" color="text.secondary">Current community composition</Typography></Box><Groups color="primary" /></Box><Box className="admin-mix"><Box className="admin-mix-total"><Typography variant="h3">{students.length}</Typography><Typography color="text.secondary">learners</Typography></Box><Box className="admin-mix-bars"><Box><Typography variant="body2">Active <strong>{activeStudents}</strong></Typography><LinearProgress value={students.length ? activeStudents / students.length * 100 : 0} variant="determinate" /></Box><Box><Typography variant="body2">Pending <strong>{students.length - activeStudents}</strong></Typography><LinearProgress value={students.length ? (students.length - activeStudents) / students.length * 100 : 0} variant="determinate" color="warning" /></Box></Box></Box><Box className="admin-alert"><WarningAmber /><Typography variant="body2">{students.length - activeStudents ? `${students.length - activeStudents} learner profile needs review.` : "All learner profiles are up to date."}</Typography></Box></Paper>
      </Box>
      <Box className="admin-bottom-grid"><Paper className="admin-panel" elevation={0}><Box className="admin-panel-heading"><Box><Typography variant="h6">Recent activity</Typography><Typography variant="body2" color="text.secondary">What needs your attention</Typography></Box><Chip label="Live" color="success" size="small" /></Box><Box className="admin-activity-list">{students.slice(0, 3).map((student, index) => <Box className="admin-activity-item" key={student.id}><Avatar>{student.username?.[0] || "S"}</Avatar><Box><Typography fontWeight={800}>{student.username || student.name}</Typography><Typography variant="body2" color="text.secondary">{index === 0 ? "Enrolled in a new learning path" : index === 1 ? "Completed profile setup" : "Awaiting account review"}</Typography></Box><Typography variant="caption" color="text.secondary">{index + 1}h ago</Typography></Box>)}</Box></Paper><Paper className="admin-panel" elevation={0}><Box className="admin-panel-heading"><Box><Typography variant="h6">Finance pulse</Typography><Typography variant="body2" color="text.secondary">Recent payment movement</Typography></Box><Payments color="secondary" /></Box><Typography variant="h3" sx={{ mt: 2 }}>${collected.toLocaleString()}</Typography><Typography variant="body2" color="text.secondary">Collected from recent transactions</Typography><LinearProgress value={72} variant="determinate" color="secondary" sx={{ mt: 3 }} /><Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}><Typography variant="caption">72% of monthly goal</Typography><Typography variant="caption" color="success.main">+8.4%</Typography></Stack></Paper></Box>
    </Box>
  );
};

export default Dashboard;
