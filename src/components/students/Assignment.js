import React, { useState, useEffect } from 'react';
import { Container, Box, Paper, Typography, Button, Divider, Avatar, Skeleton } from '@mui/material';
import { styled } from '@mui/system';

// Styled Components for Customization
const StyledCard = styled(Paper)({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
});

const StyledAvatar = styled(Avatar)({
  backgroundColor: '#2196f3',
  width: 70,
  height: 70,
  marginBottom: '15px',
  fontSize: '28px',
  fontWeight: 'bold',
});

const StyledButton = styled(Button)({
  backgroundColor: '#2196f3',
  color: '#fff',
  width: '100%',
  padding: '10px 0',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#1976d2',
  }
});

const CardsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center', // Centering the cards
  '@media (min-width: 600px)': {
    justifyContent: 'space-around', // More space on larger screens
  },
  '@media (min-width: 900px)': {
    justifyContent: 'space-between', // Even spacing for large screens
  },
});

const AssignmentsPage = () => {
  // Dummy data for assignments
  const dummyAssignments = [
    {
      id: 1,
      title: "Math Homework",
      subject: "Mathematics",
      dueDate: "2024-12-20",
    },
    {
      id: 2,
      title: "Science Project",
      subject: "Science",
      dueDate: "2024-12-18",
    },
    {
      id: 3,
      title: "History Essay",
      subject: "History",
      dueDate: "2024-12-25",
    },
    {
      id: 4,
      title: "English Presentation",
      subject: "English",
      dueDate: "2024-12-22",
    },
    {
      id: 5,
      title: "Art Assignment",
      subject: "Art",
      dueDate: "2024-12-21",
    },
    {
      id: 6,
      title: "Computer Science Lab",
      subject: "Computer Science",
      dueDate: "2024-12-26",
    },
  ];

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setAssignments(dummyAssignments);
      setLoading(false);
    }, 1500); // Simulate a delay for loading the data
  }, []);

  if (loading) return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 4 }}>
        <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" color="primary.main">
          Assignments
        </Typography>
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ marginBottom: '20px' }} />
        
        {/* Skeleton for assignment cards */}
        <CardsContainer>
          {[...Array(6)].map((_, index) => (
            <Box sx={{ flex: '1 1 100%', sm: '1 1 45%', md: '1 1 30%', maxWidth: '300px', marginBottom: '20px' }} key={index}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '12px' }} />
              <Skeleton variant="text" width="60%" sx={{ marginTop: '10px' }} />
              <Skeleton variant="text" width="80%" sx={{ marginTop: '5px' }} />
            </Box>
          ))}
        </CardsContainer>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 4 }}>
        <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" color="primary.main">
          Assignments
        </Typography>

        <CardsContainer>
          {assignments.map((assignment) => (
            <Box
              sx={{
                flex: '1 1 100%',
                sm: '1 1 45%', // 2 cards per row for medium screens
                md: '1 1 30%', // 3 cards per row for large screens
                maxWidth: '300px', // Limit the width of each card
                marginBottom: '20px',
              }}
              key={assignment.id}
            >
              <StyledCard>
                <StyledAvatar>
                  {assignment.title[0].toUpperCase()}
                </StyledAvatar>
                <Typography variant="h6" align="center" color="primary.main" fontWeight="bold">
                  {assignment.title}
                </Typography>
                <Divider sx={{ width: '100%', marginY: 1 }} />
                <Typography variant="body2" align="center" color="text.secondary">
                  Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Subject: {assignment.subject}
                </Typography>
                <StyledButton variant="contained">
                  View Details
                </StyledButton>
              </StyledCard>
            </Box>
          ))}
        </CardsContainer>
      </Box>
    </Container>
  );
};

export default AssignmentsPage;
