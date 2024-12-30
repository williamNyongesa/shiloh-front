import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Divider, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Sample data for demonstration
const sampleStudents = [
  { id: 1, name: 'John Doe', attendance: 'Present', grade: '' },
  { id: 2, name: 'Jane Smith', attendance: 'Absent', grade: '' },
  { id: 3, name: 'Sam Wilson', attendance: 'Present', grade: '' },
];

const TeacherDashboard = () => {
  const [students, setStudents] = useState(sampleStudents);
  const [attendance, setAttendance] = useState('');
  const [grades, setGrades] = useState('');

  const handleAttendanceChange = (e, studentId) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, attendance: e.target.value } : student
    );
    setStudents(updatedStudents);
  };

  const handleGradeChange = (e, studentId) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, grade: e.target.value } : student
    );
    setStudents(updatedStudents);
  };

  const handleSaveGrades = () => {
    // Here you can integrate API calls to save grades to your database
    console.log('Grades Saved:', students);
  };

  return (
    <Container>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom color="secondary">
          Teacher Dashboard
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Mark Attendance</Typography>
          <Divider sx={{ marginY: 2 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={student.attendance}
                        onChange={(e) => handleAttendanceChange(e, student.id)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Enter Grades</Typography>
          <Divider sx={{ marginY: 2 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <TextField
                        value={student.grade}
                        onChange={(e) => handleGradeChange(e, student.id)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleSaveGrades}>
            Save Grades
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TeacherDashboard;
