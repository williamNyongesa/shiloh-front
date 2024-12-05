import React, { useState, useEffect } from "react";
import { Box, Drawer, Paper, Typography, Button, Divider, useMediaQuery, AppBar, Toolbar, IconButton, Skeleton, Avatar } from "@mui/material";
import { MdAssignment, MdEvent } from "react-icons/md";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Star as StarIcon, Menu as MenuIcon, Grading as GradingIcon } from "@mui/icons-material";
import { CiSettings } from "react-icons/ci";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { PiStudent } from "react-icons/pi";
import { GrAchievement } from "react-icons/gr";
import { FaAward } from "react-icons/fa";

const StudentDashboard = () => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'))
  const [selectedSection, setSelectedSection] = useState('dashboard'); 



  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray.length > 1
      ? nameArray[0][0] + nameArray[1][0]
      : nameArray[0][0];
  };

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
  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <Typography variant="h6" color="primary">This is the Dashboard content.</Typography>;
      case 'courses':
        return <Typography variant="h6">This is the Courses content.</Typography>;
      case 'quizzes':
        return <Typography variant="h6">This is the Quizzes content.</Typography>;
      case 'assignments':
        return <Typography variant="h6">This is the Assignments content.</Typography>;
      case 'students':
        return <Typography variant="h6">This is the Students content.</Typography>;
      case 'report':
        return <Typography variant="h6">This is the Report content.</Typography>;
      case 'calendar':
        return <Typography variant="h6">This is the Calendar content.</Typography>;
      case 'events':
        return <Typography variant="h6">This is the Events content.</Typography>;
      case 'settings':
        return <Typography variant="h6">This is the Settings content.</Typography>;
      default:
        return <Typography variant="h6">Welcome! Select a section.</Typography>;
    }
  };

  // Simulate a loading time (e.g., fetching data)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const renderStats = () => (
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

  const renderCourses = () => (
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
    <Box sx={{ display: "flex", height: "100%" }}>

<Drawer
        sx={{
          marginTop: 40,
          width: 250,
          height: "100vh",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            marginTop: 8,
            width: 250,
            backgroundColor: "#424242",
            color: "white",
            height: "100%",
          },
        }}
        variant={isSmallScreen ? "temporary" : "permanent"}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ padding: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {loading ? (
              <Skeleton variant="circular" width={50} height={50} />
            ) : user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
              />
            ) : (
              <Avatar sx={{ width: 50, height: 50 }}>
                {getInitials(user.username)}
              </Avatar>
            )}
            <Box>
              {loading ? (
                <>
                  <Skeleton width={100} />
                  <Skeleton width={80} />
                </>
              ) : (
                <>
                  <Typography variant="body2">Welcome</Typography>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>Student</Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          {/* Side menu buttons */}
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<DashboardIcon />}
            onClick={() => setSelectedSection('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdAssignment />}
            onClick={() => setSelectedSection('courses')}
          >
            Courses
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdAssignment />}
            onClick={() => setSelectedSection('quizzes')}
          >
            Quizzes
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdAssignment />}
            onClick={() => setSelectedSection('assignments')}
          >
            Assignments
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<PiStudent />}
            onClick={() => setSelectedSection('students')}
          >
            Students
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<HiOutlineDocumentReport />}
            onClick={() => setSelectedSection('report')}
          >
            Report
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<SlCalender />}
            onClick={() => setSelectedSection('calendar')}
          >
            Calendar
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdEvent />}
            onClick={() => setSelectedSection('events')}
          >
            Events
          </Button>
          <Divider />
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<CiSettings />}
            onClick={() => setSelectedSection('settings')}
          >
            Settings
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<ExitToAppIcon />}
            onClick={() => setSelectedSection('logout')}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, padding: 4, color: "#fff" }}>
        <Paper sx={{ padding: 3, boxShadow: 3, marginBottom: 4 }}>
          <Typography variant="h4" align="center">WELCOME TO SHILOH</Typography>
        </Paper>

        {renderStats()}
        {renderRewardAndCertificates()}
        {renderCourses()}
        {renderContent()}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
