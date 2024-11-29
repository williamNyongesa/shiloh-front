import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Container, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Use useNavigate hook for navigation

  // Handle form submission
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        username,
        password,
      });

      // Assuming the response contains a JWT token on successful login
      if (response.data.token) {
        // Store token in localStorage (or use context, redux for global state)
        localStorage.setItem("auth_token", response.data.token);
        
        // Redirect to dashboard or home page using useNavigate
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
