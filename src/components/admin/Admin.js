import React, { useState, useEffect } from "react";
import { Box, Drawer, Paper, Typography, Button, Divider, useMediaQuery, AppBar, Toolbar, IconButton } from "@mui/material";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Star as StarIcon, Menu as MenuIcon, Grading as GradingIcon } from "@mui/icons-material";
import TransactionList from './TransactionList';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role'); 
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/home');  
    }
  }, [userRole, navigate]);

  return (
    userRole === 'admin' ? (  
      <Box sx={{ display: "flex", height: "100%" }}>
        <Drawer
          sx={{
            marginTop: 40,
            width: 250,
            height: "100vh",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              marginTop: 8,
              width: 250,
              backgroundColor: "#424242",
              color: "white",
              height: "100%",
            },
          }}
          variant={isSmallScreen ? "temporary" : "permanent"}
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box sx={{ padding: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
              />
              <Box>
                <Typography variant="body2">Welcome</Typography>
                <Typography variant="h6">Ramkumar K</Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>Admin</Typography>  {/* Role Display */}
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<DashboardIcon />}>
              Dashboard
            </Button>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<ExitToAppIcon />} onClick={() => { localStorage.removeItem('role'); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, padding: 4, color: "#fff" }}>
          <Paper sx={{ padding: 3, boxShadow: 3, marginBottom: 4 }}>
            <Typography variant="h4" align="center">WELCOME TO SHILOH</Typography>
          </Paper>
          <Header />
          <TransactionList />
        </Box>
      </Box>
    ) : null 
  );
};

export default Admin;
