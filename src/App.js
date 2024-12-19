import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Admin from './pages/Admin';
import StudentDashboard from './components/students/StudentDashboard';
import { StudentRegistration } from './components/students/StudentRegistration';
import Enrollment from './pages/enrollment/Enrollment';
import LandingPage from './components/Landing';
import { ProtectedRoute } from './components/context/AuthContext';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider, useTheme } from './components/context/ThemeContext';
import Teacher from './components/teacher';

// require('dotenv').config()

function App() {
  const { darkMode } = useTheme();
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', 
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#424242',
      },
      success: {
        main: '#4caf50',
      },
      info: {
        main: '#03a9f4',
      },
      warning: {
        main: '#ff9800',
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/enrollment" element={<Enrollment />}/>
        <Route path="/teacher" element={<Teacher/>}/>
        <Route path="/student/registration" element={<StudentRegistration />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MuiThemeProvider>
  );
}

export default App;
