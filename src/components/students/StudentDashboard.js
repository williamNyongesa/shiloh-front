import React, { useState } from "react";
import { Box, Drawer, Paper, Typography, Button, Divider, useMediaQuery, AppBar, Toolbar, IconButton} from "@mui/material";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Star as StarIcon, Menu as MenuIcon, Grading as GradingIcon } from "@mui/icons-material";


const StudentDashboard = () => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const user = JSON.parse(localStorage.getItem('user'))

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

  const renderStats = () => (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", md: "row" } }}>
      {stats.map((stat, index) => (
        <Box key={index} sx={{ width: { xs: "100%", sm: "33%" }, padding: 3 }}>
          <Paper sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: 3 }}>
            {stat.icon}
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>{stat.count}</Typography>
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
              {item === "Reward" ? <StarIcon sx={{ marginRight: 1 }} /> : <GradingIcon sx={{ marginRight: 1 }} />}
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
                  }}
                />
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
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{course.title}</Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>Lorem ipsum is simply dummy text.</Typography>
              <Box sx={{ width: "100%", height: 6, backgroundColor: "#e0e0e0", mt: 1 }}>
                <Box sx={{ width: `${course.progress}%`, height: "100%", backgroundColor: "#388e3c" }} />
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
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
              />
              <Box>
                <Typography variant="body2">Welcome</Typography>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>Student</Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<DashboardIcon />}>
              Dashboard
            </Button>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<ExitToAppIcon />}>
              Logout
            </Button>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, padding: 4 , color:"#fff"}}>
          <Paper sx={{ padding: 3, boxShadow: 3, marginBottom: 4 }}>
            <Typography variant="h4" align="center">WELCOME TO SHILOH</Typography>
          </Paper>

          {renderStats()}
          {renderRewardAndCertificates()}
          {renderCourses()}
        </Box>
      </Box>
  );
};

export default StudentDashboard;
