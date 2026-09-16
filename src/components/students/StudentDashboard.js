import React, { useState } from "react";
import { Box, Drawer, Typography, Button, Divider, useMediaQuery, Avatar, IconButton } from "@mui/material";
import { MdAssignment, MdEvent } from "react-icons/md";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Payment, Schedule, Book } from "@mui/icons-material";
import { CiSettings } from "react-icons/ci";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { PiStudent } from "react-icons/pi";
import { GrMenu } from 'react-icons/gr';
import MenuOpen from '@mui/icons-material/MenuOpen';
import StudentdashboardOverview from "./dashboardOverview";
import SettingsPage from "./Settings";
import QuizzesPage from "./Quizzes";
import SchoolCalendar from "./Calender";
import StudentReport from "./StudentReport";
import EventsPage from "./StudentEvent";
import FinancePage from "./Finance";
import StudentsPage from "./Students";
import AssignmentsPage from "./Assignment";
import ScheduleClass, { DisplayDummyData } from "./TimeTable";
import Courses from "./Courses";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Books from './Books'

const StudentDashboard = () => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const user = JSON.parse(localStorage.getItem('userDATA') || '{}');
  const [currentComponent, setCurrentComponent] = useState(<StudentdashboardOverview/>);
  const drawerWidth = 250;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };


  const getInitials = (name) => {
    const nameArray = (name || "Learner").split(" ");
    return nameArray.length > 1
      ? nameArray[0][0] + nameArray[1][0]
      : nameArray[0][0];
  };
  const handleLinkClick = (component) => {
    setCurrentComponent(component);
    if (isSmallScreen) setOpen(false);
  };
  const handleLogout = () => {
    logout();
    localStorage.removeItem('userDATA');
    navigate('/login');
  };

 
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <IconButton
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          top: 78,
          left: open ? drawerWidth + 10 : 5,
          backgroundColor: 'background.paper',
          color: 'primary.main',
          zIndex: 6000,
          borderRadius: '5px',
        }}
      >
        {open ? (<MenuOpen />) : (<GrMenu />)}
      </IconButton>

<Drawer
        sx={{
          marginTop: 40,
          width: drawerWidth,
          height: "100vh",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            marginTop: 8,
            width: drawerWidth,
            backgroundColor: "#202338",
            color: "white",
            height: "100%",
            borderRight: 0,
            padding: "12px 10px",
          },
        }}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ padding: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user.profileImage ? (
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
              
                <>
                  <Typography variant="overline" sx={{ color: "rgba(255,255,255,.6)", letterSpacing: 1.2 }}>LEARNING SPACE</Typography>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,.6)" }}>Student</Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,.45)" }}>ID: {user.student?.student_id || "--"}</Typography>
                </>
            
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          {/* Side menu buttons */}
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<DashboardIcon />}
            onClick={ ()=>handleLinkClick(<StudentdashboardOverview/>)}
          >
            Dashboard
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<MdAssignment />}
            onClick={ ()=>handleLinkClick(<Courses/>)}
          >
            Courses
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<MdAssignment />}
            onClick={() => handleLinkClick(<QuizzesPage/>)}
          >
            Quizzes
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<MdAssignment />}
            onClick={() => handleLinkClick(<AssignmentsPage/>)}
          >
            Assignments
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<PiStudent />}
            onClick={() => handleLinkClick(<StudentsPage/>)}
          >
            Students
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<HiOutlineDocumentReport />}
            onClick={() => handleLinkClick(<StudentReport/>)}
            >
            Report
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<SlCalender />}
            onClick={() => handleLinkClick(<SchoolCalendar/>)}
          >
            Calendar
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<Schedule/>}
            onClick={() => handleLinkClick(<ScheduleClass/>)}
          >
            Timetable
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<MdEvent />}
            onClick={() => handleLinkClick(<EventsPage/>)}
          >
            Events
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<Payment/>}
            onClick={() => handleLinkClick(<FinancePage/>)}
          >
            payment
          </Button>
          <Divider />
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<CiSettings />}
            onClick={() => handleLinkClick(<SettingsPage/>)}
          >
            Settings
          </Button>
          <Button
            fullWidth
            sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", padding: 1.25, justifyContent: "flex-start", borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: 'white' } }}
            startIcon={<Book />}
            onClick={() => handleLinkClick(<Books/>)}
          >
            Books
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button> 
        </Box>
      </Drawer>

      <Box className="student-content">
        {currentComponent}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
