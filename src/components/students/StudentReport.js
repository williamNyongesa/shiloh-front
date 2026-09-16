import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Skeleton,
  Avatar,
  Button,
  Paper,
  Chip,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowForward,
  ArrowUpward,
  Assessment,
  AutoGraph,
  AccessTime,
  CheckCircle,
  Download,
  EmojiEvents,
  MenuBook,
  MoreHoriz,
  PlayArrow,
  Schedule,
  TrendingUp,
  WorkspacePremium,
} from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Filler,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { getDemoUser } from "../../demoData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Filler
);

const StudentReport = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    try {
      const userData = JSON.parse(
        localStorage.getItem("userDATA") || "null"
      );

      const reportData = userData?.demo
        ? getDemoUser("student")
        : userData;

      if (reportData) {
        const studentData = reportData.student || {};

        setStudent(studentData);
        setCourses(
          Array.isArray(studentData.enrollments)
            ? studentData.enrollments
            : []
        );

        setReport(
          reportData.report || {
            attendance: 92,
            lessonsCompleted: 18,
            averageGrade: 86,
            weeklyMinutes: 184,
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            grades: [68, 73, 76, 81, 84, 88],
          }
        );
      }
    } catch (error) {
      console.error("Unable to load student report:", error);
    }
  }, []);

  const averageProgress = useMemo(() => {
    if (!courses.length) return 0;

    return Math.round(
      courses.reduce(
        (total, course) => total + Number(course.progress || 0),
        0
      ) / courses.length
    );
  }, [courses]);

  const strongestCourse = useMemo(() => {
    if (!courses.length) return null;

    return [...courses].sort(
      (a, b) =>
        Number(b.progress || 0) - Number(a.progress || 0)
    )[0];
  }, [courses]);

  const nextFocus = useMemo(() => {
    if (!courses.length) return null;

    return [...courses].sort(
      (a, b) =>
        Number(a.progress || 0) - Number(b.progress || 0)
    )[0];
  }, [courses]);

  const completedCourses = courses.filter(
    (course) => Number(course.progress || 0) >= 100
  ).length;

  const reportData = {
    labels: report?.labels || [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Average grade",
        data: report?.grades || [68, 73, 76, 81, 84, 88],
        backgroundColor: [
          "#5146e5",
          "#5146e5",
          "#5146e5",
          "#5146e5",
          "#5146e5",
          "#4fbf9f",
        ],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 28,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          color: "#7b7b8a",
        },
        grid: {
          color: "rgba(20,20,40,.06)",
        },
        border: {
          display: false,
        },
      },
    },
  };

  const downloadReport = () => {
    window.print();
  };

  const openCourse = (course) => {
    navigate("/student/courses", {
      state: {
        course,
      },
    });
  };

  const firstName =
    student?.name?.split(" ")[0] ||
    student?.first_name ||
    "Learner";

  return (
    <Container
      className="report-page"
      maxWidth="lg"
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {student ? (
            <Avatar
              sx={{
                width: 58,
                height: 58,
                bgcolor: "primary.main",
                fontWeight: 900,
                fontSize: 22,
              }}
            >
              {firstName.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Skeleton variant="circular" width={58} height={58} />
          )}

          <Box>
            <Typography className="eyebrow">
              LEARNING ANALYTICS
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.4,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {student
                ? `${firstName}'s progress`
                : "Your progress"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              A snapshot of your learning momentum, performance,
              and next steps.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={downloadReport}
          className="no-print"
          sx={{
            borderRadius: 3,
            px: 2.5,
          }}
        >
          Download report
        </Button>
      </Box>

      {/* OVERVIEW HERO */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 3,
          borderRadius: 5,
          color: "white",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #5146e5 0%, #7269f4 55%, #4fbf9f 130%)",
          boxShadow:
            "0 24px 60px rgba(81,70,229,.18)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
            right: -80,
            top: -100,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 650,
          }}
        >
          <Chip
            icon={<TrendingUp />}
            label="LEARNING MOMENTUM"
            size="small"
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,.14)",
              fontWeight: 800,
              mb: 2,
              "& .MuiChip-icon": {
                color: "#fff",
              },
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            You're building a strong learning rhythm.
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "rgba(255,255,255,.76)",
              maxWidth: 560,
              lineHeight: 1.7,
            }}
          >
            Your average course progress is {averageProgress}%.
            Keep your strongest habits going and give extra
            attention to your next focus area.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={() =>
                nextFocus && openCourse(nextFocus)
              }
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: "white",
                color: "#5146e5",
                borderRadius: 3,
                fontWeight: 800,
                "&:hover": {
                  bgcolor: "#f5f4ff",
                },
              }}
            >
              Continue learning
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/student")}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,.35)",
                borderRadius: 3,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.08)",
                },
              }}
            >
              View dashboard
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* METRICS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Overall progress",
            value: `${averageProgress}%`,
            icon: <AutoGraph />,
            color: "#5146e5",
          },
          {
            label: "Average grade",
            value: `${report?.averageGrade || 0}%`,
            icon: <Assessment />,
            color: "#4fbf9f",
          },
          {
            label: "Attendance",
            value: `${report?.attendance || 0}%`,
            icon: <CheckCircle />,
            color: "#e7a33e",
          },
          {
            label: "Study time",
            value: `${report?.weeklyMinutes || 0}m`,
            icon: <AccessTime />,
            color: "#f26b5e",
          },
        ].map((metric) => (
          <Paper
            key={metric.label}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "rgba(20,20,40,.07)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: `${metric.color}15`,
                color: metric.color,
              }}
            >
              {metric.icon}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900 }}
              >
                {metric.value}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                {metric.label}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ANALYTICS GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.6fr .9fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {/* CHART */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "rgba(20,20,40,.07)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900 }}
              >
                Performance trend
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Your grades across recent learning periods.
              </Typography>
            </Box>

            <Chip
              icon={<ArrowUpward />}
              label="Trending up"
              color="success"
              size="small"
            />
          </Box>

          <Box sx={{ height: 290 }}>
            <Bar data={reportData} options={chartOptions} />
          </Box>
        </Paper>

        {/* NEXT MOVE */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "rgba(20,20,40,.07)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 900 }}
          >
            Your next best move
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Focus on the area where a little attention can
            create the biggest improvement.
          </Typography>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 3,
              bgcolor: "#f6f5ff",
              display: "flex",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "#5146e5",
                color: "white",
              }}
            >
              <TrendingUp />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={900} noWrap>
                {nextFocus?.courses ||
                  "Keep exploring your courses"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {nextFocus
                  ? `${nextFocus.progress || 0}% complete · your next focus`
                  : "Start a course to receive personalized guidance."}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() =>
              nextFocus && openCourse(nextFocus)
            }
            sx={{
              mt: 2,
              borderRadius: 3,
            }}
          >
            Focus on this course
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Your strongest path
          </Typography>

          <Typography
            fontWeight={900}
            sx={{ mt: 0.5 }}
          >
            {strongestCourse?.courses ||
              "Your learning path is waiting"}
          </Typography>

          <LinearProgress
            value={strongestCourse?.progress || 0}
            variant="determinate"
            sx={{ mt: 1.5, height: 7, borderRadius: 5 }}
          />
        </Paper>
      </Box>

      {/* COURSE PERFORMANCE */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900 }}
          >
            Course performance
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
          >
            See how every part of your learning path is moving.
          </Typography>
        </Box>

        <Chip
          icon={<MenuBook />}
          label={`${courses.length} active`}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 2,
        }}
      >
        {courses.length ? (
          courses.map((course, index) => {
            const progress = Number(course.progress || 0);

            return (
              <Paper
                key={course.id || index}
                elevation={0}
                onClick={() => openCourse(course)}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "rgba(20,20,40,.07)",
                  cursor: "pointer",
                  transition: "all .2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "primary.main",
                    boxShadow:
                      "0 14px 35px rgba(30,30,60,.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor:
                        index % 3 === 0
                          ? "#eeedff"
                          : index % 3 === 1
                          ? "#eaf8f4"
                          : "#fff0ed",
                      color:
                        index % 3 === 0
                          ? "#5146e5"
                          : index % 3 === 1
                          ? "#4fbf9f"
                          : "#f26b5e",
                    }}
                  >
                    <MenuBook />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      fontWeight={900}
                      noWrap
                    >
                      {course.courses || "Untitled course"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {course.status || "In progress"}
                      {course.grade
                        ? ` · ${course.grade}`
                        : ""}
                    </Typography>
                  </Box>

                  <Tooltip title="Open course">
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        openCourse(course);
                      }}
                    >
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ mt: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.7,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Progress
                    </Typography>

                    <Typography
                      variant="caption"
                      fontWeight={900}
                      color="primary.main"
                    >
                      {progress}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    value={progress}
                    variant="determinate"
                    sx={{
                      height: 8,
                      borderRadius: 10,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <Chip
                      size="small"
                      icon={<Schedule />}
                      label="18 min"
                    />

                    {progress >= 100 && (
                      <Chip
                        size="small"
                        color="success"
                        icon={<CheckCircle />}
                        label="Complete"
                      />
                    )}
                  </Stack>

                  <Button
                    size="small"
                    endIcon={<PlayArrow />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openCourse(course);
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </Paper>
            );
          })
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: "center",
              gridColumn: "1 / -1",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <MenuBook
              sx={{
                fontSize: 44,
                color: "text.secondary",
                mb: 1,
              }}
            />

            <Typography fontWeight={900}>
              No courses yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Start a course to begin building your learning
              report.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/student/courses")}
            >
              Explore courses
            </Button>
          </Paper>
        )}
      </Box>

      {/* MILESTONES */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "rgba(20,20,40,.07)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              Your milestones
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              The progress you've built so far.
            </Typography>
          </Box>

          <EmojiEvents sx={{ color: "#e7a33e" }} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {[
            {
              icon: <WorkspacePremium />,
              title: "Courses completed",
              value: completedCourses,
              color: "#5146e5",
            },
            {
              icon: <CheckCircle />,
              title: "Lessons completed",
              value: report?.lessonsCompleted || 0,
              color: "#4fbf9f",
            },
            {
              icon: <AccessTime />,
              title: "Minutes this week",
              value: report?.weeklyMinutes || 0,
              color: "#e7a33e",
            },
          ].map((item) => (
            <Box
              key={item.title}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: `${item.color}08`,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.icon}
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentReport;
