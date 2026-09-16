import React, { useMemo } from "react";
import {
  ArrowForward,
  AssignmentTurnedIn,
  AutoStories,
  CalendarMonth,
  CheckCircle,
  ChevronRight,
  Groups,
  MenuBook,
  NotificationsNone,
  PlayArrow,
  Quiz,
  Schedule,
  School,
  VideoCall,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getDemoUser } from "./../demoData";
import "../App.css";

const Home = () => {
  const data = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userDATA")) || {};
    } catch {
      return {};
    }
  }, []);

  const student = data.student || {};
  const username =
    data.username ||
    student.username ||
    student.name ||
    "Learner";

  const firstName = username.split(" ")[0];

  const enrollments = Array.isArray(student.enrollments)
    ? student.enrollments
    : [];

  const assignments = Array.isArray(data.assignments)
    ? data.assignments
    : getDemoUser("student").assignments;

  const quizzes = Array.isArray(data.quizzes)
    ? data.quizzes
    : getDemoUser("student").quizzes;

  console.log(getDemoUser("student").courses)
  const courses = enrollments.length
    ? enrollments.slice(0, 3)
    : [
        {
          courses: "Foundations of Computer Science",
          progress: 68,
        },
        {
          courses: "Creative Problem Solving",
          progress: 51,
        },
        {
          courses: "Communication for Leaders",
          progress: 84,
        },
      ];

  const upcoming = [
    {
      icon: <AssignmentTurnedIn />,
      title: "Submit your reflection",
      course: "Creative Problem Solving",
      date: "Tomorrow",
      type: "Assignment",
      color: "#635BFF",
    },
    {
      icon: <Quiz />,
      title: "Leadership communication quiz",
      course: "Communication for Leaders",
      date: "Friday",
      type: "Quiz",
      color: "#F97316",
    },
    {
      icon: <VideoCall />,
      title: "Live study session",
      course: "Foundations of Computer Science",
      date: "Monday · 10:00 AM",
      type: "Session",
      color: "#00A86B",
    },
  ];

  const recentActivity = [
    {
      icon: <CheckCircle />,
      title: "Completed Introduction to Algorithms",
      time: "Today · 9:42 AM",
      color: "#00A86B",
    },
    {
      icon: <Quiz />,
      title: "Scored 86% on your latest quiz",
      time: "Yesterday · Foundations of Computer Science",
      color: "#635BFF",
    },
    {
      icon: <Groups />,
      title: "Joined the Computer Science discussion",
      time: "Yesterday · Community",
      color: "#F97316",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F7F7FA",
      }}
    >
      {/* ─────────────────────────────────────
          TOP BAR
      ───────────────────────────────────── */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          background: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1.4,
                  color: "primary.main",
                }}
              >
                SHILOH COLLEGE
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Your learning home
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton>
                <Badge color="error" variant="dot">
                  <NotificationsNone />
                </Badge>
              </IconButton>

              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "primary.main",
                  fontWeight: 800,
                }}
              >
                {firstName.charAt(0).toUpperCase()}
              </Avatar>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* ─────────────────────────────────────
            WELCOME
        ───────────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: "-1.5px",
            }}
          >
            Good morning, {firstName} 👋
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
              fontSize: 16,
            }}
          >
            Here's what's happening with your learning today.
          </Typography>
        </Box>

        {/* ─────────────────────────────────────
            TODAY STRIP
        ───────────────────────────────────── */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 4,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
              gap={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#FFF4D6",
                    color: "#D99000",
                    width: 46,
                    height: 46,
                  }}
                >
                  <Schedule />
                </Avatar>

                <Box>
                  <Typography fontWeight={900}>
                    You have 2 things to do today
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    A lesson and a little review will keep you moving.
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                to="/student"
                variant="outlined"
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 800,
                }}
              >
                Open my plan
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* ─────────────────────────────────────
            MAIN LAYOUT
        ───────────────────────────────────── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.55fr 1fr",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <Box>
            {/* NEXT UP */}
            <Box sx={{ mb: 4 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    Next up
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your most important learning activities.
                  </Typography>
                </Box>

                <Chip
                  label="Today"
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Stack>

              <Stack spacing={1.5}>
                {upcoming.map((item) => (
                  <Card
                    key={item.title}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      transition: "all .2s ease",
                      "&:hover": {
                        borderColor: item.color,
                        transform: "translateX(4px)",
                        boxShadow: `0 8px 25px ${item.color}15`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: `${item.color}14`,
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              fontWeight={900}
                              sx={{ color: item.color }}
                            >
                              {item.type.toUpperCase()}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              · {item.date}
                            </Typography>
                          </Stack>

                          <Typography
                            fontWeight={850}
                            sx={{ mt: 0.25 }}
                          >
                            {item.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {item.course}
                          </Typography>
                        </Box>

                        <IconButton>
                          <ChevronRight />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* CONTINUE ONE THING */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={900}
                sx={{ mb: 2 }}
              >
                Pick up where you left off
              </Typography>

              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  background:
                    "linear-gradient(120deg, #635BFF, #4038B5)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    justifyContent="space-between"
                    gap={3}
                  >
                    <Box>
                      <Chip
                        label="CONTINUE"
                        size="small"
                        sx={{
                          color: "white",
                          background: "rgba(255,255,255,.14)",
                          fontWeight: 900,
                          letterSpacing: 0.8,
                        }}
                      />

                      <Typography
                        variant="h5"
                        fontWeight={900}
                        sx={{ mt: 1.5 }}
                      >
                        Algorithms and flow
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          color: "rgba(255,255,255,.7)",
                        }}
                      >
                        Foundations of Computer Science · 24 min
                      </Typography>

                      <Box sx={{ mt: 2, maxWidth: 400 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="caption">
                            68% complete
                          </Typography>

                          <Typography variant="caption">
                            Lesson 13 of 18
                          </Typography>
                        </Stack>

                        <LinearProgress
                          value={68}
                          variant="determinate"
                          sx={{
                            height: 7,
                            borderRadius: 10,
                            background: "rgba(255,255,255,.15)",
                            "& .MuiLinearProgress-bar": {
                              background: "white",
                              borderRadius: 10,
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Button
                      component={Link}
                      to="/courses"
                      variant="contained"
                      startIcon={<PlayArrow />}
                      sx={{
                        background: "white",
                        color: "#5146E5",
                        borderRadius: 2,
                        px: 2.5,
                        py: 1.2,
                        fontWeight: 900,
                        "&:hover": {
                          background: "#F3F2FF",
                        },
                      }}
                    >
                      Resume
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* RECENT ACTIVITY */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    Recent activity
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    A quick look at what you've been doing.
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/student"
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{ fontWeight: 800 }}
                >
                  See all
                </Button>
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                {recentActivity.map((item, index) => (
                  <React.Fragment key={item.title}>
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: `${item.color}14`,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={800}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {item.time}
                        </Typography>
                      </Box>

                      <CheckCircle
                        sx={{
                          color: "success.main",
                          fontSize: 19,
                        }}
                      />
                    </Box>

                    {index < recentActivity.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </Paper>
            </Box>
          </Box>

          {/* RIGHT */}
          <Box>
            {/* QUICK ACTIONS */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={900}>
                  Quick actions
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Jump straight into what you need.
                </Typography>

                <Stack spacing={1}>
                  {[
                    {
                      icon: <MenuBook />,
                      title: "Browse courses",
                      to: "/courses",
                      color: "#635BFF",
                    },
                    {
                      icon: <AssignmentTurnedIn />,
                      title: "My assignments",
                      to: "/assignments",
                      color: "#00A86B",
                    },
                    {
                      icon: <Quiz />,
                      title: "Take a quiz",
                      to: "/quizzes",
                      color: "#F97316",
                    },
                    {
                      icon: <Groups />,
                      title: "Visit community",
                      to: "/community",
                      color: "#EAB308",
                    },
                  ].map((action) => (
                    <Button
                      key={action.title}
                      component={Link}
                      to={action.to}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        borderRadius: 2,
                        py: 1.2,
                        "&:hover": {
                          background: "action.hover",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          mr: 1.5,
                          bgcolor: `${action.color}14`,
                          color: action.color,
                        }}
                      >
                        {action.icon}
                      </Avatar>

                      <Typography
                        variant="body2"
                        fontWeight={800}
                        sx={{ flex: 1, textAlign: "left" }}
                      >
                        {action.title}
                      </Typography>

                      <ChevronRight
                        sx={{
                          fontSize: 18,
                          color: "text.secondary",
                        }}
                      />
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* THIS WEEK */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      This week
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Your learning calendar
                    </Typography>
                  </Box>

                  <CalendarMonth color="primary" />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  {[
                    ["M", "8"],
                    ["T", "9"],
                    ["W", "10"],
                    ["T", "11"],
                    ["F", "12"],
                    ["S", "13"],
                    ["S", "14"],
                  ].map(([day, date], index) => (
                    <Box
                      key={`${day}-${date}`}
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        py: 1,
                        borderRadius: 2,
                        background:
                          index === 2
                            ? "primary.main"
                            : "action.hover",
                        color:
                          index === 2
                            ? "primary.contrastText"
                            : "text.primary",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={700}
                      >
                        {day}
                      </Typography>

                      <Typography
                        fontWeight={900}
                        sx={{ mt: 0.5 }}
                      >
                        {date}
                      </Typography>

                      {index < 3 && (
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            bgcolor:
                              index === 2
                                ? "white"
                                : "success.main",
                            borderRadius: "50%",
                            mx: "auto",
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1.5}>
                  <Avatar
                    sx={{
                      bgcolor: "#EEEDFF",
                      color: "#635BFF",
                    }}
                  >
                    <School />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={850}
                    >
                      3 learning sessions
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Planned this week
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* MY COURSES MINI LIST */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      My courses
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Your active learning paths
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/courses"
                    size="small"
                    sx={{ fontWeight: 800 }}
                  >
                    View all
                  </Button>
                </Stack>

                <Stack>
                  {courses.map((course, index) => (
                    <Box
                      key={`${course.courses}-${index}`}
                      component={Link}
                      to="/courses"
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        "&:hover": {
                          background: "action.hover",
                          borderRadius: 2,
                        },
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor:
                            index === 0
                              ? "#EEEDFF"
                              : index === 1
                              ? "#E7F8F2"
                              : "#FFF0ED",
                          color:
                            index === 0
                              ? "#635BFF"
                              : index === 1
                              ? "#00A86B"
                              : "#F97316",
                        }}
                      >
                        <AutoStories />
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          noWrap
                        >
                          {course.courses}
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={course.progress || 0}
                          sx={{
                            mt: 0.8,
                            height: 5,
                            borderRadius: 5,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        fontWeight={800}
                        color="text.secondary"
                      >
                        {course.progress || 0}%
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* ─────────────────────────────────────
            BOTTOM COMMUNITY / ANNOUNCEMENT
        ───────────────────────────────────── */}
        <Card
          elevation={0}
          sx={{
            mt: 4,
            borderRadius: 3,
            background: "#17171C",
            color: "white",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ md: "center" }}
              gap={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,.1)",
                    color: "#FFD166",
                  }}
                >
                  <Groups />
                </Avatar>

                <Box>
                  <Typography fontWeight={900}>
                    Something new is happening in your community
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,.6)",
                      mt: 0.4,
                    }}
                  >
                    8 learners are discussing algorithms and study
                    strategies right now.
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                to="/community"
                variant="outlined"
                endIcon={<ArrowForward />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,.25)",
                  fontWeight: 800,
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255,255,255,.05)",
                  },
                }}
              >
                Join the conversation
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;