import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, Button, Skeleton, Avatar, LinearProgress, Chip, Stack } from "@mui/material";
import { ArrowForward, CheckCircle, EmojiEvents, LocalFireDepartment, MenuBook, PlayArrow, Schedule, Star, AssignmentTurnedIn, Quiz, Celebration } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StudentdashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const data = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userDATA")) || {};
    } catch (error) {
      return {};
    }
  }, []);
  const student = data.student || {};
  const enrollments = Array.isArray(student.enrollments) ? student.enrollments : [];
  const username = data.username || student.username || "Learner";
  const firstName = username.split(" ")[0];
  const totalProgress = enrollments.length ? Math.round(enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) / enrollments.length) : 0;
  const initial = username.charAt(0).toUpperCase();
  const assignments = Array.isArray(data.assignments) ? data.assignments : [];
  const quizzes = Array.isArray(data.quizzes) ? data.quizzes : [];
  const completedAssignments = assignments.filter((assignment) => assignment.status === "Submitted").length;
  const dailyGoal = 32;
  const dailyProgress = 24;
  const activities = [
    { icon: <AssignmentTurnedIn />, title: "Submitted peer communication notes", meta: "Yesterday · Communication for Leaders", tone: "#4fbf9f" },
    { icon: <Quiz />, title: "Scored 86% on your last quiz", meta: "2 days ago · Foundations of Computer Science", tone: "#5146e5" },
    { icon: <Celebration />, title: "Unlocked the Consistent Learner badge", meta: "3 days ago · 7 day streak", tone: "#e7a33e" },
  ];

  const handleDashboardAction = (section) => {
    navigate('/student');

    const sectionIdMap = {
      continue: 'continue-learning',
      momentum: 'momentum-panel',
      recommendations: 'recommendations-panel',
      history: 'activity-panel',
      goal: 'goal-panel',
    };

    const targetId = sectionIdMap[section];
    if (!targetId) return;

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Simulate a loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className="learning-dashboard">
      <Box className="dashboard-heading">
        <Box>
          <Typography className="eyebrow">YOUR LEARNING SPACE</Typography>
          <Typography variant="h4" sx={{ mt: 0.5 }}>Good morning, {firstName} <span aria-hidden="true">👋</span></Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>A little progress today adds up to something remarkable.</Typography>
        </Box>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48, fontWeight: 800 }}>{initial}</Avatar>
      </Box>

      <Paper className="learning-hero" elevation={0}>
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 470 }}>
          <Chip label="KEEP GOING" size="small" sx={{ bgcolor: "rgba(255,255,255,.16)", color: "white", fontWeight: 800, letterSpacing: 1 }} />
          <Typography variant="h4" sx={{ color: "white", mt: 2 }}>{enrollments[0]?.courses || "Your next breakthrough is one lesson away."}</Typography>
          <Typography sx={{ color: "rgba(255,255,255,.76)", mt: 1 }}>Pick up where you left off and keep your learning streak alive.</Typography>
          <Button variant="contained" onClick={() => handleDashboardAction('continue')} endIcon={<ArrowForward />} sx={{ mt: 3, bgcolor: "white", color: "#5146e5", '&:hover': { bgcolor: '#f2f1ff' } }}>Continue learning</Button>
        </Box>
        <Box className="hero-orbit" aria-hidden="true"><MenuBook /></Box>
      </Paper>

      <Box className="metric-grid">
          {[
          { label: "Courses in progress", value: enrollments.length, icon: <MenuBook />, color: "#5146e5" },
          { label: "Learning streak", value: "7 days", icon: <LocalFireDepartment />, color: "#f26b5e" },
          { label: "XP earned", value: "1,240", icon: <Star />, color: "#e7a33e" },
          { label: "Overall progress", value: `${totalProgress}%`, icon: <CheckCircle />, color: "#4fbf9f" },
        ].map((metric) => (
          <Paper key={metric.label} className="metric-card" elevation={0}>
            <Avatar sx={{ bgcolor: `${metric.color}18`, color: metric.color }} variant="rounded">{metric.icon}</Avatar>
            <Box sx={{ minWidth: 0 }}><Typography variant="h6">{loading ? <Skeleton width={58} /> : metric.value}</Typography><Typography variant="body2" color="text.secondary">{metric.label}</Typography></Box>
          </Paper>
        ))}
      </Box>

      <Box className="dashboard-columns">
        <Paper className="content-panel" elevation={0}>
          <Box id="continue-learning" className="panel-heading"><Box><Typography variant="h6">Continue learning</Typography><Typography variant="body2" color="text.secondary">Your active path</Typography></Box><Button size="small" onClick={() => handleDashboardAction('continue')} endIcon={<ArrowForward />}>View all</Button></Box>
          {loading ? <Skeleton variant="rounded" height={145} /> : enrollments.length ? enrollments.slice(0, 2).map((enrollment, index) => (
            <Box className="course-row" key={`${enrollment.courses}-${index}`}>
              <Avatar variant="rounded" sx={{ bgcolor: index ? "#fff0ed" : "#eeedff", color: index ? "#f26b5e" : "#5146e5" }}><MenuBook /></Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={800} noWrap>{enrollment.courses || "Untitled course"}</Typography><Typography variant="body2" color="text.secondary">Lesson {index + 1} · 18 min left</Typography><LinearProgress variant="determinate" value={enrollment.progress || 0} sx={{ mt: 1.5 }} /></Box>
              <Button aria-label={`Resume ${enrollment.courses || "course"}`} onClick={() => handleDashboardAction('continue')} variant="contained" size="small" startIcon={<PlayArrow />}>Resume</Button>
            </Box>
          )) : <Box className="empty-state"><MenuBook /><Typography fontWeight={700}>Your learning path starts here</Typography><Typography variant="body2" color="text.secondary">Explore a course to begin building momentum.</Typography></Box>}
        </Paper>

        <Paper id="momentum-panel" className="content-panel" elevation={0}>
          <Box className="panel-heading"><Box><Typography variant="h6">Your momentum</Typography><Typography variant="body2" color="text.secondary">Small wins, every week</Typography></Box><EmojiEvents sx={{ color: "#e7a33e" }} /></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, my: 2 }}><Box className="progress-ring"><Typography variant="h5">{totalProgress}%</Typography></Box><Box><Typography fontWeight={800}>You’re making progress</Typography><Typography variant="body2" color="text.secondary">Keep your 7-day streak going to unlock a new badge.</Typography></Box></Box>
          <Stack direction="row" spacing={1}><Chip icon={<LocalFireDepartment />} label="7 day streak" /><Chip icon={<Star />} label="1,240 XP" /></Stack>
        </Paper>
      </Box>

      <Paper id="recommendations-panel" className="content-panel" elevation={0}>
        <Box className="panel-heading"><Box><Typography variant="h6">Recommended for you</Typography><Typography variant="body2" color="text.secondary">Curated from your learning path</Typography></Box><Button size="small" onClick={() => handleDashboardAction('recommendations')} endIcon={<ArrowForward />}>Explore</Button></Box>
        <Box className="recommendation-grid">
          {[{ title: "Study smarter, not longer", meta: "Learning skills · 12 min", tone: "#5146e5" }, { title: "Build your next habit", meta: "Personal growth · 8 min", tone: "#4fbf9f" }, { title: "A better way to revise", meta: "Study skills · 15 min", tone: "#f26b5e" }].map((item) => <Box className="recommendation" key={item.title}><Box className="recommendation-mark" sx={{ bgcolor: item.tone }}><Schedule /></Box><Typography fontWeight={800}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.meta}</Typography></Box>)}
        </Box>
      </Paper>

      <Box className="dashboard-columns dashboard-lower-grid">
        <Paper id="goal-panel" className="content-panel goal-panel" elevation={0}>
          <Box className="panel-heading"><Box><Typography variant="h6">Today&apos;s learning goal</Typography><Typography variant="body2" color="text.secondary">Keep the habit light and consistent</Typography></Box><LocalFireDepartment sx={{ color: "#f26b5e" }} /></Box>
          <Box className="goal-progress-row"><Box className="goal-ring"><Typography variant="h5">{dailyProgress}<Typography component="span" variant="body2">/{dailyGoal}m</Typography></Typography></Box><Box sx={{ flex: 1 }}><Typography fontWeight={800}>{dailyGoal - dailyProgress} minutes to go</Typography><Typography variant="body2" color="text.secondary">A short focused session keeps your streak alive.</Typography><LinearProgress variant="determinate" value={(dailyProgress / dailyGoal) * 100} sx={{ mt: 1.5 }} /></Box></Box>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}><Chip size="small" label={`${completedAssignments} assignment complete`} /><Chip size="small" label={`${quizzes.length} quizzes ready`} /></Stack>
        </Paper>
        <Paper className="content-panel achievements-panel" elevation={0}>
          <Box className="panel-heading"><Box><Typography variant="h6">Achievements</Typography><Typography variant="body2" color="text.secondary">You are building momentum</Typography></Box><EmojiEvents sx={{ color: "#e7a33e" }} /></Box>
          <Box className="achievement-row"><Avatar sx={{ bgcolor: "#fff4d8", color: "#e7a33e" }}><LocalFireDepartment /></Avatar><Box><Typography fontWeight={800}>Consistent Learner</Typography><Typography variant="body2" color="text.secondary">7 day streak unlocked</Typography></Box><CheckCircle color="success" /></Box>
          <Box className="achievement-row"><Avatar sx={{ bgcolor: "#eeedff", color: "#5146e5" }}><Star /></Avatar><Box><Typography fontWeight={800}>First 1,000 XP</Typography><Typography variant="body2" color="text.secondary">A strong start to your path</Typography></Box><CheckCircle color="success" /></Box>
        </Paper>
      </Box>

      <Paper id="activity-panel" className="content-panel activity-panel" elevation={0}>
        <Box className="panel-heading"><Box><Typography variant="h6">Recent activity</Typography><Typography variant="body2" color="text.secondary">Your latest learning wins</Typography></Box><Button size="small" onClick={() => handleDashboardAction('history')} endIcon={<ArrowForward />}>View history</Button></Box>
        <Box className="activity-list">{activities.map((activity) => <Box className="activity-item" key={activity.title}><Avatar variant="rounded" sx={{ bgcolor: `${activity.tone}18`, color: activity.tone }}>{activity.icon}</Avatar><Box><Typography fontWeight={800}>{activity.title}</Typography><Typography variant="body2" color="text.secondary">{activity.meta}</Typography></Box></Box>)}</Box>
      </Paper>
    </Box>
  );
};

export default StudentdashboardOverview;
