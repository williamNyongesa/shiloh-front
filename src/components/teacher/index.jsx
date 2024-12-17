import { Box, TableCell, TableHead, TableRow, TableBody, Table, Paper, TableContainer, Divider, Typography } from '@mui/material';
import React from 'react';
import TeacherDashboard from './TeacherDasboard';
function Teacher() {
const sampleTimetable = [
  { day: 'Monday', class: 'Math', time: '10:00 AM - 12:00 PM' },
  { day: 'Tuesday', class: 'Science', time: '1:00 PM - 3:00 PM' },
  { day: 'Wednesday', class: 'History', time: '9:00 AM - 11:00 AM' },
];
    return (
      <Box>

<Box sx={{ marginBottom: 2 }}>
  <Typography variant="h6">Your Timetable</Typography>
  <Divider sx={{ marginY: 2 }} />
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Day</TableCell>
          <TableCell>Class</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sampleTimetable.map((timetable, index) => (
          <TableRow key={index}>
            <TableCell>{timetable.day}</TableCell>
            <TableCell>{timetable.class}</TableCell>
            <TableCell>{timetable.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


      <TeacherDashboard/>
    </Box>
  );
}

export default Teacher;
