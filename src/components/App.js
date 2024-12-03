import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Admin from './admin/Admin';
import StudentDashboard from './students/StudentDashboard';
import { StudentRegistration } from './students/StudentRegistration';
import Enrollment from './enrollment/Enrollment';
import { ThemeProvider } from '@emotion/react';
import { createTheme, useMediaQuery } from '@mui/material';
import LandingPage from './Landing';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from '../PrivateRoute';

function App() {
  const theme = createTheme({
    palette: {
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

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <ThemeProvider theme={theme}>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={<PrivateRoute element={<Admin />} role="admin" redirectTo="/" />}
            />
            <Route
              path="/student"
              element={<PrivateRoute element={<StudentDashboard />} role="student" redirectTo="/" />}
            />
            <Route
              path="/student/registration"
              element={<PrivateRoute element={<StudentRegistration />} role="admin" redirectTo="/" />}
            />
            <Route
              path="/enrollment"
              element={<PrivateRoute element={<Enrollment />} role="student" redirectTo="/" />}
            />
          </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
