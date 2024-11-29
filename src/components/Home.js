import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';

const Home = () => {
  return (
    <div>
      <Box
        style={{
          backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/0/08/Shiloh_Christian_School_entrance_in_Springdale%2C_Arkansas.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#000',
        }}
      >
        <Box style={{ textAlign: 'center' }}>
          <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: 20 }}>
            Welcome to Shiloh College
          </Typography>
          <Typography variant="h6" style={{ marginBottom: 20 }}>
            Empowering the future, one student at a time.
          </Typography>
          <Link to="/student/registration" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Join Us Today
            </Button>
          </Link>
        </Box>
      </Box>


      <Container style={{ marginTop: 40 }}>
        <Box display="flex" flexWrap="wrap" justifyContent="space-around">
 
          <Box
            component={Paper}
            style={{
              width: '30%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PersonAddIcon style={{ fontSize: 60, color: '#1976d2' }} />
            <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: 20 }}>
              Student Registration
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
              Register now and start your journey with Shiloh College. Join our community of passionate learners.
            </Typography>
            <Link to="/student/registration" style={{ textDecoration: 'none' }}>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </Link>
          </Box>


          <Box
            component={Paper}
            style={{
              padding: 20,
              width: '30%',
              marginBottom: 20,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LoginIcon style={{ fontSize: 60, color: '#1976d2' }} />
            <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: 20 }}>
              Student Login
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
              Already a student? Log in to access your profile, assignments, and grades.
            </Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button size="small" color="primary">
                Login Now
              </Button>
            </Link>
          </Box>


          <Box
            component={Paper}
            style={{
              padding: 20,
              width: '30%',
              marginBottom: 20,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <InfoIcon style={{ fontSize: 60, color: '#1976d2' }} />
            <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: 20 }}>
              About Us
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
              Learn more about our mission, values, and what makes Shiloh College a unique place for learning.
            </Typography>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <Button size="small" color="primary">
                Read More
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box style={{ backgroundColor: '#1DA1F2', color: 'white', padding: 20, textAlign: 'center' }}>
        <Typography variant="body2">
          © 2024 Shiloh College. All Rights Reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default Home;
