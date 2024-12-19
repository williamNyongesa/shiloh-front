import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Divider, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TeacherDashboardOverview from './teachersDashboardOverview';
import {  List, ListItem, ListItemButton, ListItemIcon, ListItemText,  Avatar, Drawer, IconButton } from '@mui/material';
import { Dashboard as DashboardIcon, School as SchoolIcon, Assignment as AssignmentIcon, Star as StarIcon, Notifications as NotificationsIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { FaAward } from 'react-icons/fa';

// Sample data for demonstration
const sampleStudents = [
  { id: 1, name: 'John Doe', attendance: 'Present', grade: '' },
  { id: 2, name: 'Jane Smith', attendance: 'Absent', grade: '' },
  { id: 3, name: 'Sam Wilson', attendance: 'Present', grade: '' },
];


// Sidebar styles using MUI sx prop
const drawerWidth = 240;

const Sidebar = () => {
  const [open, setOpen] = useState(true);  // State to control sidebar visibility

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#2E3B55', // Dark Blue for the sidebar
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
        {/* Sidebar Header: Teacher's Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 3 }}>
          <Avatar sx={{ width: 60, height: 60, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Teacher Name
          </Typography>
          <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
            Math Department
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#3C4A5E' }} />

        {/* Sidebar Navigation Links */}
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
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Assignments" />
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
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <FaAward style={{ color: 'white', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText primary="Certificates" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
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
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F5F5F5',
          padding: 3,
          transition: 'margin 0.3s ease-in-out',
          marginLeft: open ? drawerWidth : 0,
        }}
      >
        {/* You can add the main content of the teacher's dashboard here */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Teacher Dashboard</Typography>
      </Box>

      {/* Toggle Sidebar Button */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          top: 20,
          left: open ? drawerWidth - 30 : 10,
          backgroundColor: '#2E3B55',
          color: 'white',
        }}
      >
        {open ? '>' : '<'}
      </IconButton>
    </Box>
  );
};


const TeacherDashboard = () => {
  const [students, setStudents] = useState(sampleStudents);
  const [attendance, setAttendance] = useState('');
  const [grades, setGrades] = useState('');

  const handleAttendanceChange = (e, studentId) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, attendance: e.target.value } : student
    );
    setStudents(updatedStudents);
  };

  const handleGradeChange = (e, studentId) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, grade: e.target.value } : student
    );
    setStudents(updatedStudents);
  };

  const handleSaveGrades = () => {
    // Here you can integrate API calls to save grades to your database
    console.log('Grades Saved:', students);
  };

  return (
    <Container>
      <Sidebar/>
      
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom color="secondary">
          Teacher Dashboard
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Mark Attendance</Typography>
          <Divider sx={{ marginY: 2 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={student.attendance}
                        onChange={(e) => handleAttendanceChange(e, student.id)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Enter Grades</Typography>
          <Divider sx={{ marginY: 2 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <TextField
                        value={student.grade}
                        onChange={(e) => handleGradeChange(e, student.id)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleSaveGrades}>
            Save Grades
          </Button>
        </Box>
      </Box>
      <TeacherDashboardOverview/>
    </Container>
  );
};

export default TeacherDashboard;
