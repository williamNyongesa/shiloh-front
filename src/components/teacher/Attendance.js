import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

import {
  Checkbox,
} from "@mui/material";

export const MarkAttendance = () => {
  const [students, setStudents] = useState([
    // Mock data; replace with actual API response
    { id: 1, name: "John Doe", course: "Math", status: "" },
    { id: 2, name: "Jane Smith", course: "Science", status: "" },
    { id: 3, name: "Bob Johnson", course: "History", status: "" },
  ]);
  const [message, setMessage] = useState("");

  const handleStatusChange = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const attendanceData = students.map(({ id, course, status }) => ({
        student_id: id,
        course,
        status,
      }));
      const response = await axios.post("http://localhost:5000/attendance", {
        attendance: attendanceData,
      });
      setMessage(response.data.message || "Attendance marked successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error marking attendance."
      );
    }
  };

  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>
        Mark Attendance
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Present</TableCell>
              <TableCell>Absent</TableCell>
              <TableCell>Late</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={student.status === "Present"}
                    onChange={() => handleStatusChange(student.id, "Present")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={student.status === "Absent"}
                    onChange={() => handleStatusChange(student.id, "Absent")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={student.status === "Late"}
                    onChange={() => handleStatusChange(student.id, "Late")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Attendance
        </Button>
      </Box>
      {message && (
        <Typography variant="body1" color="secondary" my={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
};


export const AttendanceReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("/attendance/report", {
        params: { start_date: startDate, end_date: endDate },
      });
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>
        Generate Attendance Report
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.student_id}</TableCell>
                <TableCell>{record.course}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
