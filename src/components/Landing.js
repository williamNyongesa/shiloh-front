import React from 'react';
import { Box, Button, Typography, Container, Card, CardContent } from '@mui/material';
import { School as SchoolIcon, Book as BookIcon, People as PeopleIcon } from '@mui/icons-material';

const LandingPage = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3f51b5',
          color: 'white',
          height: '60vh',
          textAlign: 'center',
          padding: 3,
        }}
      >
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Welcome to Our School
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: 3 }}>
            Empowering Students to Succeed and Excel
          </Typography>
          <Button variant="contained" color="secondary" size="large" href="/register">
            Get Started
          </Button>
        </Box>
      </Box>

      <Container sx={{ paddingTop: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
          Our Features
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Card sx={{ boxShadow: 3, textAlign: 'center', width: 300 }}>
            <CardContent>
              <SchoolIcon sx={{ fontSize: 50, color: '#3f51b5' }} />
              <Typography variant="h5" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Quality Education
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', marginTop: 2 }}>
                Our experienced teachers provide quality education that prepares students for the future.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 3, textAlign: 'center', width: 300 }}>
            <CardContent>
              <BookIcon sx={{ fontSize: 50, color: '#3f51b5' }} />
              <Typography variant="h5" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Extensive Library
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', marginTop: 2 }}>
                Access a vast collection of books and resources to enhance learning and knowledge.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 3, textAlign: 'center', width: 300 }}>
            <CardContent>
              <PeopleIcon sx={{ fontSize: 50, color: '#3f51b5' }} />
              <Typography variant="h5" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Community & Support
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', marginTop: 2 }}>
                Join a community of learners and gain access to support systems to thrive academically.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Box
        sx={{
          backgroundColor: '#3f51b5',
          color: 'white',
          padding: 6,
          textAlign: 'center',
          marginTop: 6,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
          Ready to Start Your Journey with Us?
        </Typography>
        <Button variant="contained" color="secondary" size="large" href="/register">
          Join Now
        </Button>
      </Box>

      <Box
        sx={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Our School. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
