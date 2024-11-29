import React from "react";
import { Box, Drawer, Paper, Typography, Button, Divider } from "@mui/material";

const StudentDashboard = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#424242',
            color: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              style={{ width: 50, height: 50, borderRadius: '50%' }}
            />
            <Box>
              <Typography variant="body2">Welcome</Typography>
              <Typography variant="h6">Ramkumar K</Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>Student</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Button fullWidth sx={{ color: 'white', textAlign: 'left', padding: 1 }} >
            Dashboard
          </Button>
          <Button fullWidth sx={{ color: 'white', textAlign: 'left', padding: 1 }} >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, padding: 4 }}>
        <Paper sx={{ padding: 3, boxShadow: 3, marginBottom: 4 }}>
          <Typography variant="h4" align="center">WELCOME TO SHILOH</Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ width: { xs: '100%', sm: '33%' }, padding: 3 }}>
            <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>29</Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>Courses To Do</Typography>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '33%' }, padding: 3 }}>
            <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>6</Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>Overdue Courses</Typography>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '33%' }, padding: 3 }}>
            <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>1</Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>Completed Courses</Typography>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ width: { xs: '100%', sm: '50%' }, padding: 3 }}>
            <Paper sx={{ padding: 3, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Reward</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: '#b0bec5',
                    }}
                  ></Box>
                ))}
              </Box>
              <Button sx={{ mt: 2 }} color="primary">View All</Button>
            </Paper>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '50%' }, padding: 3 }}>
            <Paper sx={{ padding: 3, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Certificates</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: '#b0bec5',
                    }}
                  ></Box>
                ))}
              </Box>
              <Button sx={{ mt: 2 }} color="primary">View All</Button>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ padding: 3 }}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 1, pb: 2, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Courses</Typography>
              <Button sx={{ color: 'primary.main' }}>View All</Button>
            </Box>

            {[{ title: "Basics of HTML", progress: 13 },
              { title: "Angular in Steps", progress: 73 },
              { title: "Bootstrap Foundation", progress: 60 }]
              .map((course, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>Lorem ipsum is simply dummy text.</Typography>
                    <Box sx={{ width: '100%', height: 6, backgroundColor: '#e0e0e0', mt: 1 }}>
                      <Box sx={{
                        width: `${course.progress}%`,
                        height: '100%',
                        backgroundColor: '#388e3c',
                      }} />
                    </Box>
                  </Box>
                  <Button sx={{ color: 'primary.main' }}>Continue</Button>
                </Box>
              ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
