import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Box } from "@mui/material";

const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const baseUrl = process.env.BASE_URL;


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`https://shiloh-server-2t51.onrender.com/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("There was an error fetching students!", error);
    }
  };

  const addStudent = async () => {
    if (!newStudentName) return;
    setLoading(true);
    try {
      await axios.post(`https://shiloh-server-2t51.onrender.com/students`, { name: newStudentName });
      setNewStudentName("");
      fetchStudents();
    } catch (error) {
      console.error("There was an error adding the student!", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`https://shiloh-server-2t51.onrender.com/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("There was an error deleting the student!", error);
    }
  };

  const handleEditOpen = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const updateStudent = async () => {
    if (!selectedStudent?.name) return;
    setLoading(true);
    try {
      await axios.put(`https://shiloh-server-2t51.onrender.com/students/${selectedStudent.id}`, { name: selectedStudent.name });
      setOpenDialog(false);
      fetchStudents();
    } catch (error) {
      console.error("There was an error updating the student!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Student Management</h1>

      <Box mb={2}>
        <TextField
          label="Student Name"
          variant="outlined"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={addStudent} disabled={loading} style={{ marginTop: 10 }}>
          {loading ? <CircularProgress size={24} /> : "Add Student"}
        </Button>
      </Box>

      <List>
        {students.map((student) => (
          <ListItem key={student.id}>
            <ListItemText primary={student.name} />
            <Button onClick={() => handleEditOpen(student)} color="secondary">
              Edit
            </Button>
            <Button onClick={() => deleteStudent(student.id)} color="error">
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <TextField
            label="Student Name"
            variant="outlined"
            value={selectedStudent?.name || ""}
            onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={updateStudent} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
