import React, { useState, useEffect } from "react";
import { Box, Drawer, Paper, Typography, Button, Divider, useMediaQuery, Avatar } from "@mui/material";
import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Star as StarIcon, Menu as MenuIcon, Grading as GradingIcon } from "@mui/icons-material";
import TransactionList from '../components/admin/TransactionList';
import Header from '../components/admin/Header';
import { useNavigate } from 'react-router-dom';
import Users from "../components/admin/Users";
import { FaUser } from "react-icons/fa";

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);
  const handleLinkClick = (component) => {
    setCurrentComponent(component);
  };

  return (
    user.role === 'admin' ? (
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
              <Avatar
                src={user.avatar || "https://via.placeholder.com/50"}
                alt="Profile"
                sx={{ width: 50, height: 50 }}
              />
              <Box>
                <Typography variant="body2">Welcome</Typography>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>Admin</Typography>  {/* Role Display */}
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<DashboardIcon />} onClick={()=>handleLinkClick()}>
              Dashboard
            </Button>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<FaUser />} onClick={()=> handleLinkClick(<Users/>) }>
              Users
            </Button>
            <Button fullWidth sx={{ color: "white", textAlign: "left", padding: 1 }} startIcon={<FaUser />} onClick={()=> handleLinkClick(<TransactionList/>) }>
              Transactions
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
          {/* <Header /> */}
          {currentComponent}
        </Box>
      </Box>
    ) : null
  );
};

export default Admin;
