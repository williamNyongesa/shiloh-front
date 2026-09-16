import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  School as SchoolIcon,
  MonetizationOn as MonetizationOnIcon,
  Notifications as NotificationsIcon,
  VerifiedUser,
  Book,
  Person,
} from "@mui/icons-material";
import TransactionList from "../components/admin/TransactionList";
import Header from "../components/admin/Header";
import { useNavigate } from "react-router-dom";
import Users from "../components/admin/Users";
import FileUpload from "../components/admin/Alumini";
import FinanceOverview from "../components/admin/FinanceOverview";
import SchoolCalendar from "../components/admin/Calender";
import Notification from "../components/admin/Notification";
import Dashboard from "../components/admin/Overview";
import Books from "../components/admin/Books";
import Profile from "../components/admin/Profile";
import Messages from "../components/admin/Messages";

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(<Dashboard />);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLinkClick = (component) => {
    setCurrentComponent(component);
    if (isSmallScreen) {
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    user?.role === "admin" && (
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Drawer */}
        <Drawer
          sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 250,
              backgroundColor: "#424242",
              color: "white",
              height: "100vh",
              paddingTop: 8
            },
          }}
          variant={isSmallScreen ? "temporary" : "permanent"}
          anchor="left"
          open={isSmallScreen ? drawerOpen : true}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={user?.avatar || "https://via.placeholder.com/50"}
                alt="Profile"
                sx={{ width: 50, height: 50 }}
              />
              <Box>
                <Typography variant="body2">Welcome</Typography>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Admin
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<DashboardIcon />}
              onClick={() => handleLinkClick(<Dashboard />)}
            >
              Dashboard
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<VerifiedUser />}
              onClick={() => handleLinkClick(<Users />)}
            >
              Users
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<MonetizationOnIcon />}
              onClick={() => handleLinkClick(<TransactionList />)}
            >
              Transactions
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<SchoolIcon />}
              onClick={() => handleLinkClick(<FileUpload />)}
            >
              Alumni
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<MonetizationOnIcon />}
              onClick={() => handleLinkClick(<FinanceOverview />)}
            >
              Finance
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<SchoolIcon />}
              onClick={() => handleLinkClick(<SchoolCalendar />)}
            >
              Calendar
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<NotificationsIcon />}
              onClick={() => handleLinkClick(<Notification />)}
            >
              Notifications
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<Book />}
              onClick={() => handleLinkClick(<Books />)}
            >
              Books
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<Person />}
              onClick={() => handleLinkClick(<Profile />)}
            >
              Profile
            </Button>
            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<Person />}
              onClick={() => handleLinkClick(<Messages />)}
            >
              Messages
            </Button>            

            <Button
              fullWidth
              sx={{ color: "white", textAlign: "left", padding: 1 }}
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, padding: 4, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
          <Header />
          {currentComponent}
        </Box>
      </Box>
    )
  );
};

export default Admin;
