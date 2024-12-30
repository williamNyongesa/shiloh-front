import React, { useState, useEffect } from "react";
import { Box, Drawer, Paper, Typography, Button, Divider, useMediaQuery, Skeleton, Avatar, IconButton } from "@mui/material";
import { MdAssignment, MdEvent } from "react-icons/md";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Payment, Schedule } from "@mui/icons-material";
import { CiSettings } from "react-icons/ci";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { PiStudent } from "react-icons/pi";
import { GrMenu } from 'react-icons/gr';
import MenuOpen from '@mui/icons-material/MenuOpen';
import StudentdashboardOverview, { renderCourses } from "./dashboardOverview";
import SettingsPage from "./Settings";
import QuizzesPage from "./Quizzes";
import SchoolCalendar from "./Calender";
import StudentReport from "./StudentReport";
import EventsPage from "./StudentEvent";
import FinancePage from "./Finance";
import StudentsPage from "./Students";
import AssignmentsPage from "./Assignment";
import ScheduleClass, { DisplayDummyData, Timetable } from "./TimeTable";
import Courses from "./Courses";

const StudentDashboard = () => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'))
  const [selectedSection, setSelectedSection] = useState('dashboard'); 
  const [currentComponent, setCurrentComponent] = useState(<StudentdashboardOverview/>);
  const drawerWidth = 250;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };


  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray.length > 1
      ? nameArray[0][0] + nameArray[1][0]
      : nameArray[0][0];
  };
  const handleLinkClick = (component) => {
    setCurrentComponent(component);
  };

 
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          top: 60,
          left: open ? drawerWidth + 10 : 5,
          backgroundColor: '#2E3B55',
          color: 'pink',
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
            backgroundColor: "#424242",
            color: "white",
            height: "100%",
          },
        }}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
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
            onClick={ ()=>handleLinkClick(<StudentdashboardOverview/>)}
          >
            Dashboard
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdAssignment />}
            onClick={ ()=>handleLinkClick(<Courses/>)}
          >
            Courses
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdAssignment />}
            onClick={() => handleLinkClick(<QuizzesPage/>)}
          >
            Quizzes
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdAssignment />}
            onClick={() => handleLinkClick(<AssignmentsPage/>)}
          >
            Assignments
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<PiStudent />}
            onClick={() => handleLinkClick(<StudentsPage/>)}
          >
            Students
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<HiOutlineDocumentReport />}
            onClick={() => handleLinkClick(<StudentReport/>)}
            >
            Report
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<SlCalender />}
            onClick={() => handleLinkClick(<SchoolCalendar/>)}
          >
            Calendar
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<Schedule/>}
            onClick={() => handleLinkClick(<Timetable/>)}
          >
            Timetable
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<MdEvent />}
            onClick={() => handleLinkClick(<EventsPage/>)}
          >
            Events
          </Button>
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<Payment/>}
            onClick={() => handleLinkClick(<FinancePage/>)}
          >
            payment
          </Button>
          <Divider />
          <Button
            fullWidth
            sx={{ color: "white", textAlign: "left", padding: 1 }}
            startIcon={<CiSettings />}
            onClick={() => handleLinkClick(<SettingsPage/>)}
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
        <Paper sx={{ padding: 3, boxShadow: 3}}>
          <Typography variant="h4" align="center">WELCOME TO SHILOH</Typography>
        </Paper>
        {currentComponent}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
