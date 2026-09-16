import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import StudentDashboard from "./components/students/StudentDashboard";
import { StudentRegistration } from "./components/students/StudentRegistration";
import Enrollment from "./pages/enrollment/Enrollment";
import LandingPage from "./components/Landing";
import { ProtectedRoute } from "./components/context/AuthContext";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { useTheme } from "./components/context/ThemeContext";
import Teacher from "./components/teacher";
import "./index.css";

// require('dotenv').config()

function App() {
  const { darkMode } = useTheme();
  const theme = createTheme({
    typography: {
      fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      h1: { fontFamily: '"Manrope", "DM Sans", sans-serif', fontWeight: 800 },
      h2: { fontFamily: '"Manrope", "DM Sans", sans-serif', fontWeight: 800 },
      h3: { fontFamily: '"Manrope", "DM Sans", sans-serif', fontWeight: 800 },
      h4: { fontFamily: '"Manrope", "DM Sans", sans-serif', fontWeight: 800 },
      h5: { fontFamily: '"Manrope", "DM Sans", sans-serif', fontWeight: 800 },
      h6: { fontFamily: '"Manrope", "DM Sans", sans-serif', fontWeight: 800 },
      button: { textTransform: "none", fontWeight: 700 },
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#5146e5",
      },
      secondary: {
        main: "#f26b5e",
      },
      success: {
        main: "#4caf50",
      },
      info: {
        main: "#03a9f4",
      },
      warning: {
        main: "#e7a33e",
      },
      background: {
        default: darkMode ? "#111426" : "#f7f8fc",
        paper: darkMode ? "#191d32" : "#ffffff",
      },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole="student">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/enrollment"
          element={
            <ProtectedRoute requiredRole="student">
              <Enrollment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <Teacher />
            </ProtectedRoute>
          }
        />
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
