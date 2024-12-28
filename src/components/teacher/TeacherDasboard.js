import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Divider, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Drawer, IconButton } from '@mui/material';
import TeacherDashboardOverview from './teachersDashboardOverview';
import { Dashboard as DashboardIcon, School as SchoolIcon, Assignment as AssignmentIcon, Star as StarIcon, Notifications as NotificationsIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon, Menu, MenuOpen, CheckCircleOutline } from '@mui/icons-material';
import { FaAward, FaHamburger } from 'react-icons/fa';
import Quizzes from './Quizess';
import { GrMenu } from 'react-icons/gr';
import Courses from './Courses';
import Notification from './Notification';
import Grading from './Grading';
import { MarkAttendance } from './Attendance';

const drawerWidth = 240;

const Sidebar = ({ currentComponent, setCurrentComponent }) => {
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) ;
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleLinkClick = (component) => {
    setCurrentComponent(component);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#2E3B55',
            color: 'white',
            paddingTop: 2,
            paddingBottom: 2,
            marginTop: 7,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 3 }}>
          <Avatar sx={{ width: 60, height: 60, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
            {user.subject}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#3C4A5E' }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }} onClick={()=>handleLinkClick(<Courses/>)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }} onClick={()=>handleLinkClick(<Quizzes/>)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Assignments & Quizess" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Rewards" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }} onClick={()=>handleLinkClick(<Grading/>)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <FaAward style={{ color: 'white', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText primary="Student Grading" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}onClick={()=>handleLinkClick(<Notification/>)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }} onClick={() => handleLinkClick(<MarkAttendance />)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <CheckCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Mark Attendance" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ borderColor: '#3C4A5E' }} />

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }} >
              <ListItemIcon sx={{ color: 'white' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

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
        {open ? (<MenuOpen />) : (<GrMenu/>)}
      </IconButton>
    </Box>
  );
};

const TeacherDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState(null);
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {currentComponent}
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
