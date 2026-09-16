import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Drawer,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
} from "@mui/material";
import { TeacherDash } from "./teachersDashboardOverview";
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  MenuOpen,
  CheckCircleOutline,
} from "@mui/icons-material";
import { FaAward } from "react-icons/fa";
import Quizzes from "./Quizess";
import { GrMenu } from "react-icons/gr";
import Courses from "./Courses";
import Notification from "./Notification";
import Grading from "./Grading";
import { MarkAttendance } from "./Attendance";
import { useNavigate } from "react-router-dom";
import { getDemoUser } from "../../demoData";
import TeacherSettingsPage from "./TeacherSettings";

const drawerWidth = 240;

const TeacherStudents = () => {
  const students = getDemoUser("teacher").teacher.students;
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={800}>
        Your students
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Track learner momentum across your courses.
      </Typography>
      {students.map((student) => (
        <Paper
          key={student.id}
          sx={{ p: 2.5, mb: 1.5, border: "1px solid", borderColor: "divider" }}
          elevation={0}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {student.student_name[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>{student.student_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {student.course} · Last active {student.lastActive}
              </Typography>
              <LinearProgress
                value={student.progress}
                variant="determinate"
                sx={{ mt: 1 }}
              />
            </Box>
            <Chip
              label={`${student.progress}%`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

const TeacherSettings = () => (
  <Container maxWidth="sm" sx={{ py: 4 }}>
    <Typography variant="h4" fontWeight={800}>
      Settings
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>
      Manage your teaching preferences.
    </Typography>
    <Paper
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
      elevation={0}
    >
      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Email notifications"
      />
      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Weekly class summary"
      />
      <Divider sx={{ my: 2 }} />
      <Typography fontWeight={800}>Availability</Typography>
      <Typography color="text.secondary">
        Monday - Friday, 9:00 AM - 4:00 PM
      </Typography>
    </Paper>
  </Container>
);

const Sidebar = ({ currentComponent, setCurrentComponent }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleLinkClick = (component) => {
    setCurrentComponent(component);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userDATA");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2E3B55",
            color: "white",
            paddingTop: 2,
            paddingBottom: 2,
            marginTop: 7,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            mb: 3,
          }}
        >
          <Avatar sx={{ width: 60, height: 60, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {user?.username || "Teacher"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
            {user?.subject || "Computer Science"}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#3C4A5E" }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<TeacherDash />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<Courses />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<Quizzes />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Assignments & Quizess" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<TeacherStudents />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Rewards" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<Grading />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <FaAward style={{ color: "white", fontSize: "1.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Student Grading" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<Notification />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<MarkAttendance />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <CheckCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Mark Attendance" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={() => handleLinkClick(<TeacherSettingsPage />)}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ borderColor: "#3C4A5E" }} />

          <ListItem disablePadding>
            <ListItemButton sx={{ color: "white" }} onClick={handleLogout}>
              <ListItemIcon sx={{ color: "white" }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          top: 60,
          left: open ? drawerWidth + 10 : 5,
          backgroundColor: "#2E3B55",
          color: "pink",
          zIndex: 6000,
          borderRadius: "5px",
        }}
      >
        {open ? <MenuOpen /> : <GrMenu />}
      </IconButton>
    </Box>
  );
};

const TeacherDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState(<TeacherDash />);
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        currentComponent={currentComponent}
        setCurrentComponent={setCurrentComponent}
      />
      <Box sx={{ flexGrow: 1, p: 3 }}>{currentComponent}</Box>
    </Box>
  );
};

export default TeacherDashboard;
