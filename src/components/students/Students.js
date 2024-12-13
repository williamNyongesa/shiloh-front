import React from 'react';
import { Container, Box, Paper, Typography, Button, Avatar, Divider } from '@mui/material';

// Sample user data
const users = [
  { "id": 1, "email": "garciamelissa@example.com", "username": "cassandracastillo", "role": "admin" },
  { "id": 2, "email": "christinahale@example.net", "username": "joerussell", "role": "teacher" },
  { "id": 3, "email": "zacharylindsey@example.com", "username": "charles39", "role": "teacher" },
  { "id": 4, "email": "christina05@example.com", "username": "nhendrix", "role": "student" },
  { "id": 5, "email": "kennethphillips@example.org", "username": "josephsantiago", "role": "student" },
  { "id": 6, "email": "joy@dmail.com", "username": "joy", "role": "student" },
  { "id": 9, "email": "sss@mail.com", "username": "kellyhudson", "role": "student" },
  { "id": 10, "email": "Marakawilliam@gmail.com", "username": "William", "role": "student" },
  { "id": 11, "email": "willkimando@yahoo.com", "username": "willkimando", "role": "student" },
  { "id": 12, "email": "mike@gmail.com", "username": "mike", "role": "student" },
  { "id": 13, "email": "mwangimonica123@gmail.com", "username": "michelle", "role": "student" },
  { "id": 14, "email": "bboy@mail.com", "username": "brandon", "role": "student" }
];

const StudentsPage = () => {
  // Filter students only
  const students = users.filter(user => user.role === 'student');

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Students List
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {students.map((student) => (
            <Box sx={{ flex: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }} key={student.id}>
              <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, marginBottom: 2 }}>
                  {student.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="h6" align="center">
                  {student.username}
                </Typography>
                <Divider sx={{ width: '100%', marginY: 1 }} />
                <Typography variant="body2" align="center" color="text.secondary">
                  Email: {student.email}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Role: {student.role}
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                  View Details
                </Button>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default StudentsPage;
