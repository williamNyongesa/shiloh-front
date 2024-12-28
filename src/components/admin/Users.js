import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from "../Searchbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password:"",
  });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/home');
    } else {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      await checkTokenExpiration();
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateUser = async () => {
    try {
      await checkTokenExpiration();
      await axios.post('http://localhost:5000/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const handleEditUser = async () => {
    try {
      await checkTokenExpiration();
      await axios.put(`http://localhost:5000/users/${selectedUser.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error editing user", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const updatedToken = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${updatedToken}`
        }
      });
      if (response.status === 401) {
        await refreshToken();
        const newToken = localStorage.getItem('access_token');
        await fetch(`http://localhost:5000/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${newToken}`
          }
        });
      }
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const checkTokenExpiration = async () => {
    const tokenExpiration = JSON.parse(localStorage.getItem('tokenExpiration'));
    const now = new Date().getTime();

    if (tokenExpiration && now >= tokenExpiration) {
      await refreshToken();
    }
  };

  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      const response = await axios.post('http://localhost:5000/users/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refresh_token}`
        }
      });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('tokenExpiration', JSON.stringify(new Date().getTime() + 60 * 60 * 1000)); // Assuming token is valid for 1 hour
    } catch (error) {
      console.error("Error refreshing token", error);
      navigate('/login');
    }
  };



  return (
    user?.role === 'admin' ? (
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box sx={{ flexGrow: 1, padding: 4, color: "#fff" }}>
        <SearchBar fetchData={fetchUsers} placeholder="Search users..." dataKey="username" />

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
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateUser} fullWidth>Create</Button>
          </Box>
        </Modal>

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
