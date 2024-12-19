import React, { useState, useEffect } from "react";
import { Box, Drawer, Paper, Typography, Button, Divider, useMediaQuery, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, IconButton } from "@mui/material";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming you're using axios for API requests
import { FaUserCircle } from "react-icons/fa";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For edit/view user
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch users once when component mounts or after creating/updating/deleting a user
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/home');
    } else {
      fetchUsers();
    }
  }, [users, navigate]);  // Dependency array, making it only run on mount or when `user` changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users'); // Replace with your API endpoint
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle create user form submission
  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:5000/users', formData); // Replace with your API endpoint
      setIsCreateModalOpen(false);
      fetchUsers(); // Fetch the updated list of users
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  // Handle edit user form submission
  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${selectedUser.id}`, formData); // Replace with your API endpoint
      setIsEditModalOpen(false);
      fetchUsers(); // Fetch the updated list of users
    } catch (error) {
      console.error("Error editing user", error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`); // Replace with your API endpoint
      fetchUsers(); // Fetch the updated list of users after deletion
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    user?.role === 'admin' ? (
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box sx={{ flexGrow: 1, padding: 4, color: "#fff" }}>
          <Paper sx={{ padding: 3, boxShadow: 3, marginBottom: 4 }}>
            <Typography variant="h4" align="center">WELCOME TO SHILOH</Typography>
          </Paper>

          {/* Users Table */}
          <Paper sx={{ padding: 3, boxShadow: 3, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>Users List</Typography>
            <Button variant="contained" color="primary" onClick={() => setIsCreateModalOpen(true)}>Create New User</Button>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => { setSelectedUser(user); setFormData(user); setIsEditModalOpen(true); }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Create User Modal */}
        <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <Box sx={{ padding: 4, maxWidth: 400, margin: "auto", backgroundColor: "white", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Create New User</Typography>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateUser} fullWidth>Create</Button>
          </Box>
        </Modal>

        {/* Edit User Modal */}
        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <Box sx={{ padding: 4, maxWidth: 400, margin: "auto", backgroundColor: "white", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Edit User</Typography>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleEditUser} fullWidth>Update</Button>
          </Box>
        </Modal>
      </Box>
    ) : null
  );
};

export default Users;
