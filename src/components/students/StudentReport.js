import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, Skeleton, Badge, Avatar, styled } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip } from 'chart.js';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// Initialize chart.js plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StudentReport = () => {
  const [student, setStudent] = useState(null);  // Set to null initially to check loading state
  const [courses, setCourses] = useState(null);  // Set to null initially to check loading state
  const [performanceData, setPerformanceData] = useState(null);  // Set to null initially to check loading state

  // Fetch data from local storage and set state
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userDATA'));  // Get data stored in localStorage

    if (userData && userData.student) {  // Ensure student data exists
      setStudent(userData.student);  // Get the student object from local storage
      setCourses(userData.student.enrollments);  // Set courses as enrollments from the student data
      
      // Dummy performance data (you can update this with actual data if needed)
      setPerformanceData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Grades Over Time',
          data: [75, 80, 85, 90, 95],
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        }],
      });
    }
  }, []);

  return (
    <Container>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
        {student ? (
          <>
            {/* Badge with Avatar */}
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar alt={student.name} src="/static/images/avatar/1.jpg" />
            </StyledBadge>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{student.name}</Typography>
              <Typography variant="body1">ID: {student.student_id}</Typography>
              <Typography variant="body1">Phone: {student.phone_number}</Typography>
              <Typography variant="body1">Email: {student.email}</Typography>
              <Typography variant="body1">Enrolled on: {new Date(student.enrolled_date).toLocaleDateString()}</Typography>
            </Box>
          </>
        ) : (
          <Skeleton variant="circular" width={100} height={100} />
        )}
      </Box>

      <Divider sx={{ margin: '20px 0' }} />

      {/* Courses List Section */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        {courses ? 'Course List' : <Skeleton width="50%" />}
      </Typography>
      {courses ? (
        courses.map((course, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{course.courses}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">Grade: {course.grade || 'Not Available'}</Typography>
              <Typography variant="body1">Status: {course.status}</Typography>
              <Typography variant="body1">Progress: {course.progress}%</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Skeleton variant="rectangular" width="100%" height={100} />
      )}

      <Divider sx={{ margin: '20px 0' }} />

      {/* Performance Overview Section */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        {performanceData ? 'Performance Overview' : <Skeleton width="50%" />}
      </Typography>
      <Box sx={{ marginBottom: 3 }}>
        {performanceData ? (
          <Bar data={performanceData} options={{ responsive: true }} />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={300} />
        )}
      </Box>

      <Divider sx={{ margin: '20px 0' }} />
    </Container>
  );
};

export default StudentReport;
