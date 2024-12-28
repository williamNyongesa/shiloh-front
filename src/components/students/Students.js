import React, { useEffect, useState } from 'react';
import { Container, Box, Paper, Typography, Button, Avatar, Divider, TextField, Autocomplete, Skeleton } from '@mui/material';
import { styled } from '@mui/system';

// Styled Components for Customization
const StyledAutocomplete = styled(Autocomplete)({
  width: '100%',
  marginBottom: '20px',
  '& .MuiInputBase-root': {
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    padding: '8px 12px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    }
  },
  '& .MuiInputLabel-root': {
    color: '#333',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: '#333',
  }
});

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
  backgroundColor: '#ff5722',
  width: 70,
  height: 70,
  marginBottom: '15px',
  fontSize: '28px',
  fontWeight: 'bold',
});

const StyledButton = styled(Button)({
  backgroundColor: '#ff5722',
  color: '#fff',
  width: '100%',
  padding: '10px 0',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#e64a19',
  }
});

const StyledBox = styled(Box)({
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  marginTop: '30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  color: 'InfoText'
});

// Card Container Styles for Responsiveness
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
  paddingTop: 5
});

const ComboBox = ({ students }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div>
      <StyledAutocomplete
        disablePortal
        options={students.filter((student) =>
          student.username.toLowerCase().includes(inputValue.toLowerCase()) // Filter by username
        )}
        getOptionLabel={(option) => option.username} // Show the username in the list
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Update the input value
        onChange={(event, newValue) => setSelectedStudent(newValue)} // Set selected student
        renderInput={(params) => <TextField {...params} label="Search for a student" />}
      />
      
      {/* Display the selected student's details */}
      {selectedStudent && (
        <StyledBox>
          <Typography variant="h6">Selected Student:</Typography>
          <Typography variant="body1">Username: {selectedStudent.username}</Typography>
          <Typography variant="body1">Email: {selectedStudent.email}</Typography>
          <Typography variant="body1">Role: {selectedStudent.role}</Typography>
        </StyledBox>
      )}
    </div>
  );
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from the API when the component mounts
  useEffect(() => {
    fetch('https://shiloh-server.onrender.com//users')
      .then((response) => response.json())
      .then((data) => {
        const studentData = data.filter(user => user.role === 'student');
        setStudents(studentData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students.');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 4 }}>
        <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" color="primary.main">
          Students List
        </Typography>
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ marginBottom: '20px' }} />
        
        {/* Skeleton for student cards */}
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

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 4 }}>
        <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" color="primary.main">
          Students
        </Typography>
        <ComboBox students={students} />

        <CardsContainer>
          {students.map((student) => (
            <Box
              sx={{
                flex: '1 1 100%',
                sm: '1 1 45%', // 2 cards per row for medium screens
                md: '1 1 30%', // 3 cards per row for large screens
                maxWidth: '300px', // Limit the width of each card
                marginBottom: '20px',
              }}
              key={student.id}
            >
              <StyledCard>
                <StyledAvatar>
                  {student.username[0].toUpperCase()}
                </StyledAvatar>
                <Typography variant="h6" align="center" color="primary.main" fontWeight="bold">
                  {student.username}
                </Typography>
                <Divider sx={{ width: '100%', marginY: 1 }} />
                <Typography variant="body2" align="center" color="text.secondary">
                  Email: {student.email}
                </Typography>
                {/* <Typography variant="body2" align="center" color="text.secondary">
                  Role: {student.role}
                </Typography>
                <StyledButton variant="contained">
                  View Details
                </StyledButton> */}
              </StyledCard>
            </Box>
          ))}
        </CardsContainer>
      </Box>
    </Container>
  );
};

export default StudentsPage;
