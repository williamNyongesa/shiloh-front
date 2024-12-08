import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, Card, CardContent, CardHeader, Avatar, Accordion, AccordionSummary, AccordionDetails, Skeleton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip } from 'chart.js';
import { Dashboard as DashboardIcon, School as SchoolIcon, CheckCircle as CheckCircleIcon, AccessAlarm as AccessAlarmIcon } from '@mui/icons-material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// Initialize chart.js plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

const StudentReport = () => {
  const [student, setStudent] = useState(null);  // Set to null initially to check loading state
  const [courses, setCourses] = useState(null);  // Set to null initially to check loading state
  const [upcomingEvents, setUpcomingEvents] = useState(null);  // Set to null initially to check loading state
  const [performanceData, setPerformanceData] = useState(null);  // Set to null initially to check loading state

  // Fetch dummy student data
  useEffect(() => {
    // Simulating API call with dummy data
    setTimeout(() => {
      setStudent({
        name: 'John Doe',
        id: 'S12345',
        age: 20,
        enrollmentDate: '2022-08-15',
        profilePicture: 'https://via.placeholder.com/150',
      });

      setCourses([
        { title: 'React for Beginners', grade: 'A', status: 'Completed', progress: 100 },
        { title: 'Advanced JavaScript', grade: 'B+', status: 'In Progress', progress: 70 },
        { title: 'Data Structures & Algorithms', grade: 'B', status: 'Completed', progress: 85 },
      ]);

      setUpcomingEvents([
        { title: 'Final Exam - React', date: '2024-12-20', type: 'Exam' },
        { title: 'Project Submission - JavaScript', date: '2024-12-15', type: 'Assignment' },
      ]);

      // Dummy performance data
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
    }, 2000);  // Simulate a delay of 2 seconds for fetching data
  }, []);

  return (
    <Container>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
        {student ? (
          <>
            <Avatar alt="Student Profile Picture" src={student.profilePicture} sx={{ width: 100, height: 100 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{student.name}</Typography>
              <Typography variant="body1">ID: {student.id}</Typography>
              <Typography variant="body1">Age: {student.age}</Typography>
              <Typography variant="body1">Enrolled: {student.enrollmentDate}</Typography>
            </Box>
          </>
        ) : (
          <Skeleton variant="circular" width={100} height={100} />
        )}
      </Box>

      <Divider sx={{ margin: '20px 0' }} />

      {/* Summary Statistics Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ width: '30%' }}>
            <Card>
              <CardHeader
                title={<Skeleton width="60%" />}
                subheader={<Skeleton width="40%" />}
                avatar={<Skeleton variant="circular" width={40} height={40} />}
              />
              <CardContent>
                <Skeleton width="60%" />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

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

      {/* Courses List Section */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        {courses ? 'Course List' : <Skeleton width="50%" />}
      </Typography>
      {courses ? (
        courses.map((course, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{course.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">Grade: {course.grade}</Typography>
              <Typography variant="body1">Status: {course.status}</Typography>
              <Typography variant="body1">Progress: {course.progress}%</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Skeleton variant="rectangular" width="100%" height={100} />
      )}

      <Divider sx={{ margin: '20px 0' }} />

      {/* Upcoming Events Section */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        {upcomingEvents ? 'Upcoming Deadlines' : <Skeleton width="50%" />}
      </Typography>
      {upcomingEvents ? (
        upcomingEvents.map((event, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Typography variant="body1">{event.title}</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>{event.date}</Typography>
          </Box>
        ))
      ) : (
        <Skeleton variant="rectangular" width="100%" height={60} />
      )}
    </Container>
  );
};

export default StudentReport;
