import React, { useMemo, useRef, useState } from "react";
import {
  ArrowBack,
  ArrowForward,
  AutoStories,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Close,
  Download,
  ExpandMore,
  Group,
  Lock,
  MenuBook,
  MoreHoriz,
  PlayArrow,
  RadioButtonUnchecked,
  Schedule,
  Star,
  TrendingUp,
  VideoLibrary,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const demoCourses = [
  {
    id: 1,
    name: "Foundations of Computer Science",
    slug: "foundations-computer-science",
    level: "Intermediate",
    students: 124,
    color: "#635BFF",
    description:
      "Learn the foundations of computational thinking, algorithms, data structures and problem solving.",
    instructor: "Dr. Sarah Mitchell",
    rating: 4.9,
    progress: 68,
    lessons: [
      {
        id: 101,
        title: "How Computers Think",
        topic: "Computer Science Foundations",
        duration: "12:14",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Understand how computers represent information and follow instructions.",
        resources: ["Lesson notes.pdf", "Thinking exercises.pdf"],
      },
      {
        id: 102,
        title: "Data Structures",
        topic: "Computer Science Foundations",
        duration: "18:42",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
        description:
          "Explore the fundamental structures used to organize and work with data.",
        resources: ["Data structures cheat sheet.pdf"],
      },
      {
        id: 103,
        title: "Algorithms and Flow",
        topic: "Algorithms",
        duration: "24:18",
        completed: false,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Learn how algorithms break complex problems into predictable steps.",
        resources: ["Algorithm worksheet.pdf", "Flowchart examples.pdf"],
      },
      {
        id: 104,
        title: "Loops and Conditions",
        topic: "Algorithms",
        duration: "16:31",
        completed: false,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
        description:
          "Use conditions and repetition to create more powerful algorithms.",
        resources: ["Practice problems.pdf"],
      },
      {
        id: 105,
        title: "Your First Algorithm",
        topic: "Project",
        duration: "28:12",
        completed: false,
        locked: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Build and explain your first complete algorithm.",
        resources: ["Project brief.pdf"],
      },
    ],
  },

  {
    id: 2,
    name: "Creative Problem Solving",
    slug: "creative-problem-solving",
    level: "Beginner",
    students: 89,
    color: "#00A86B",
    description:
      "Develop practical frameworks for understanding problems and creating better solutions.",
    instructor: "James Okafor",
    rating: 4.8,
    progress: 51,
    lessons: [
      {
        id: 201,
        title: "What Makes a Good Problem?",
        topic: "Problem Solving",
        duration: "10:22",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Learn to distinguish symptoms from the real problem.",
        resources: ["Problem framing worksheet.pdf"],
      },
      {
        id: 202,
        title: "Finding the Real Problem",
        topic: "Problem Solving",
        duration: "15:20",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
        description:
          "Use questioning techniques to discover what is actually happening.",
        resources: ["Question framework.pdf"],
      },
      {
        id: 203,
        title: "Framing Better Questions",
        topic: "Critical Thinking",
        duration: "20:11",
        completed: false,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Turn vague challenges into questions you can actually solve.",
        resources: ["Question prompts.pdf"],
      },
      {
        id: 204,
        title: "Generating Ideas",
        topic: "Creative Thinking",
        duration: "17:44",
        completed: false,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
        description:
          "Explore techniques for generating and evaluating ideas.",
        resources: ["Ideation toolkit.pdf"],
      },
    ],
  },

  {
    id: 3,
    name: "Communication for Leaders",
    slug: "communication-leaders",
    level: "Advanced",
    students: 67,
    color: "#F97316",
    description:
      "Build the communication skills needed to lead conversations, teams and presentations.",
    instructor: "Grace Wanjiku",
    rating: 4.9,
    progress: 84,
    lessons: [
      {
        id: 301,
        title: "Executive Presence",
        topic: "Leadership",
        duration: "14:10",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Learn how presence influences how people experience your leadership.",
        resources: ["Leadership notes.pdf"],
      },
      {
        id: 302,
        title: "Storytelling",
        topic: "Communication",
        duration: "21:30",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
        description:
          "Use stories to make complex ideas memorable.",
        resources: ["Storytelling framework.pdf"],
      },
      {
        id: 303,
        title: "Difficult Conversations",
        topic: "Communication",
        duration: "19:05",
        completed: true,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        description:
          "Navigate difficult conversations with clarity and empathy.",
        resources: ["Conversation planner.pdf"],
      },
      {
        id: 304,
        title: "Final Presentation",
        topic: "Capstone",
        duration: "31:42",
        completed: false,
        video:
          "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
        description:
          "Bring everything together in a final leadership presentation.",
        resources: ["Presentation rubric.pdf"],
      },
    ],
  },
];

const Courses = () => {
  const [filter, setFilter] = useState("All courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const [search, setSearch] = useState("");
  const videoRef = useRef(null);

  const courses = useMemo(() => {
    return demoCourses.map((course) => ({
      ...course,
      lessons: course.lessons.map((lesson) => ({
        ...lesson,
        completed:
          lesson.completed || Boolean(completedLessons[lesson.id]),
      })),
    }));
  }, [completedLessons]);

  const visibleCourses = courses.filter((course) => {
    const matchesFilter =
      filter === "All courses" || course.level === filter;

    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const openCourse = (course) => {
    setSelectedCourse(course);
    setDrawerOpen(true);
  };

  const openLesson = (course, lesson) => {
    if (lesson.locked) return;

    setSelectedCourse(course);
    setSelectedLesson(lesson);
    setDrawerOpen(false);
    setVideoProgress(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeLesson = () => {
    setSelectedLesson(null);
    setVideoProgress(0);
  };

  const markLessonComplete = () => {
    if (!selectedLesson) return;

    setCompletedLessons((previous) => ({
      ...previous,
      [selectedLesson.id]: true,
    }));
  };

  const getCurrentCourse = () => {
    return courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === selectedLesson?.id)
    );
  };

  const goToNextLesson = () => {
    const course = getCurrentCourse();

    if (!course || !selectedLesson) return;

    const currentIndex = course.lessons.findIndex(
      (lesson) => lesson.id === selectedLesson.id
    );

    const nextLesson = course.lessons[currentIndex + 1];

    if (!nextLesson || nextLesson.locked) return;

    openLesson(course, nextLesson);
  };

  const goToPreviousLesson = () => {
    const course = getCurrentCourse();

    if (!course || !selectedLesson) return;

    const currentIndex = course.lessons.findIndex(
      (lesson) => lesson.id === selectedLesson.id
    );

    const previousLesson = course.lessons[currentIndex - 1];

    if (!previousLesson) return;

    openLesson(course, previousLesson);
  };

  const handleVideoTimeUpdate = (event) => {
    const video = event.currentTarget;

    if (!video.duration) return;

    setVideoProgress(
      Math.round((video.currentTime / video.duration) * 100)
    );
  };

  const handleVideoEnded = () => {
    markLessonComplete();
  };

  const getCourseProgress = (course) => {
    const completed = course.lessons.filter(
      (lesson) =>
        lesson.completed || completedLessons[lesson.id]
    ).length;

    return Math.round((completed / course.lessons.length) * 100);
  };

  /*
   * --------------------------------------------------
   * LESSON PLAYER
   * --------------------------------------------------
   */

  if (selectedLesson) {
    const course = getCurrentCourse();
    const courseProgress = course
      ? getCourseProgress(course)
      : 0;

    const lessonCompleted =
      selectedLesson.completed ||
      completedLessons[selectedLesson.id];

    return (
      <Box sx={{ minHeight: "100vh", background: "#F7F7FA" }}>
        {/* Player header */}
        <Box
          sx={{
            height: 68,
            px: { xs: 2, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#111116",
            color: "white",
          }}
        >
          <Button
            onClick={closeLesson}
            startIcon={<ArrowBack />}
            sx={{
              color: "white",
              fontWeight: 800,
            }}
          >
            Back to course
          </Button>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="caption"
              sx={{ opacity: 0.7 }}
            >
              COURSE PROGRESS
            </Typography>

            <Typography fontWeight={900}>
              {courseProgress}%
            </Typography>
          </Stack>
        </Box>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1fr) 330px",
              },
              gap: 3,
            }}
          >
            {/* Video */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  overflow: "hidden",
                  borderRadius: 3,
                  background: "#000",
                }}
              >
                <video
                  ref={videoRef}
                  key={selectedLesson.id}
                  src={selectedLesson.video}
                  controls
                  playsInline
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  style={{
                    width: "100%",
                    display: "block",
                    maxHeight: "70vh",
                    background: "#000",
                  }}
                />
              </Paper>

              {/* Video progress */}
              <LinearProgress
                variant="determinate"
                value={videoProgress}
                sx={{
                  height: 4,
                  borderRadius: 0,
                  "& .MuiLinearProgress-bar": {
                    background: course?.color || "#635BFF",
                  },
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={900}
                    >
                      {selectedLesson.title}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 0.75 }}
                    >
                      {course?.name} · {selectedLesson.topic}
                    </Typography>
                  </Box>

                  {lessonCompleted && (
                    <Chip
                      icon={<CheckCircle />}
                      label="Completed"
                      color="success"
                      sx={{ fontWeight: 800 }}
                    />
                  )}
                </Stack>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 2,
                    maxWidth: 800,
                    lineHeight: 1.7,
                  }}
                >
                  {selectedLesson.description}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant={
                      lessonCompleted
                        ? "outlined"
                        : "contained"
                    }
                    startIcon={
                      lessonCompleted ? (
                        <CheckCircle />
                      ) : (
                        <Check />
                      )
                    }
                    onClick={markLessonComplete}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 850,
                    }}
                  >
                    {lessonCompleted
                      ? "Lesson completed"
                      : "Mark as complete"}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => {
                      const resource =
                        selectedLesson.resources?.[0];

                      if (resource) {
                        alert(
                          `Demo download: ${resource}`
                        );
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 800,
                    }}
                  >
                    Resources
                  </Button>
                </Stack>
              </Box>

              {/* Previous / Next */}
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Button
                    startIcon={<ChevronLeft />}
                    onClick={goToPreviousLesson}
                    disabled={
                      !course ||
                      course.lessons.findIndex(
                        (lesson) =>
                          lesson.id === selectedLesson.id
                      ) === 0
                    }
                  >
                    Previous
                  </Button>

                  <Button
                    variant="contained"
                    endIcon={<ChevronRight />}
                    onClick={goToNextLesson}
                    disabled={
                      !course ||
                      course.lessons.findIndex(
                        (lesson) =>
                          lesson.id === selectedLesson.id
                      ) ===
                        course.lessons.length - 1
                    }
                    sx={{ fontWeight: 850 }}
                  >
                    Next lesson
                  </Button>
                </Stack>
              </Paper>
            </Box>

            {/* Curriculum */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                alignSelf: "start",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Typography
                  variant="caption"
                  fontWeight={900}
                  color="text.secondary"
                  letterSpacing={1}
                >
                  COURSE CURRICULUM
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{ mt: 0.5 }}
                >
                  {course?.name}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Course progress
                    </Typography>

                    <Typography
                      variant="caption"
                      fontWeight={800}
                    >
                      {courseProgress}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    value={courseProgress}
                    variant="determinate"
                    sx={{
                      mt: 0.75,
                      height: 7,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                        background:
                          course?.color || "#635BFF",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Divider />

              <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
                {course?.lessons.map((lesson, index) => {
                  const active =
                    lesson.id === selectedLesson.id;

                  const completed =
                    lesson.completed ||
                    completedLessons[lesson.id];

                  return (
                    <Box
                      key={lesson.id}
                      onClick={() =>
                        openLesson(course, lesson)
                      }
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                        p: 1.75,
                        cursor: lesson.locked
                          ? "not-allowed"
                          : "pointer",
                        background: active
                          ? `${course.color}10`
                          : "transparent",
                        opacity: lesson.locked ? 0.45 : 1,
                        borderLeft: active
                          ? `3px solid ${course.color}`
                          : "3px solid transparent",
                        "&:hover": {
                          background: lesson.locked
                            ? "transparent"
                            : `${course.color}08`,
                        },
                      }}
                    >
                      {completed ? (
                        <CheckCircle
                          sx={{
                            color: "success.main",
                            fontSize: 20,
                          }}
                        />
                      ) : lesson.locked ? (
                        <Lock
                          sx={{ fontSize: 19 }}
                        />
                      ) : (
                        <RadioButtonUnchecked
                          sx={{
                            color: course.color,
                            fontSize: 20,
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={
                            active || completed
                              ? 800
                              : 650
                          }
                        >
                          {index + 1}. {lesson.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {lesson.duration}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

  /*
   * --------------------------------------------------
   * COURSE LIST
   * --------------------------------------------------
   */

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 3, md: 5 } }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          LEARNING LIBRARY
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ md: "flex-end" }}
          gap={2}
        >
          <Box>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{ mt: 0.5 }}
            >
              Your courses
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Learn through focused lessons, real examples and
              hands-on practice.
            </Typography>
          </Box>

          <Button
            component="label"
            variant="outlined"
            startIcon={<VideoLibrary />}
            sx={{
              borderRadius: 2,
              fontWeight: 800,
            }}
          >
            My learning library
          </Button>
        </Stack>
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          overflowX: "auto",
        }}
      >
        {[
          "All courses",
          "Beginner",
          "Intermediate",
          "Advanced",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            onClick={() => setFilter(item)}
            sx={{
              height: 38,
              px: 1,
              fontWeight: 800,
              background:
                filter === item
                  ? "primary.main"
                  : "action.hover",
              color:
                filter === item
                  ? "primary.contrastText"
                  : "text.primary",
            }}
          />
        ))}
      </Box>

      {/* Course grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {visibleCourses.map((course) => {
          const progress = getCourseProgress(course);

          const completed = course.lessons.filter(
            (lesson) =>
              lesson.completed ||
              completedLessons[lesson.id]
          ).length;

          const nextLesson =
            course.lessons.find(
              (lesson) =>
                !lesson.completed &&
                !completedLessons[lesson.id] &&
                !lesson.locked
            ) || course.lessons[0];

          return (
            <Card
              key={course.id}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                transition: "all .2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: course.color,
                  boxShadow: `0 18px 45px ${course.color}18`,
                },
              }}
            >
              {/* Course cover */}
              <CardActionArea
                onClick={() => openCourse(course)}
              >
                <Box
                  sx={{
                    height: 170,
                    p: 2.5,
                    position: "relative",
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${course.color}, ${course.color}99)`,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: 220,
                      height: 220,
                      borderRadius: "50%",
                      background:
                        "rgba(255,255,255,.08)",
                      right: -80,
                      top: -90,
                    }}
                  />

                  <AutoStories
                    sx={{
                      position: "relative",
                      color: "white",
                      fontSize: 44,
                    }}
                  />

                  <Chip
                    label={course.level}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 18,
                      left: 20,
                      color: "white",
                      background:
                        "rgba(0,0,0,.18)",
                      fontWeight: 800,
                    }}
                  />

                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: 18,
                      right: 20,
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    {progress}%
                  </Typography>
                </Box>
              </CardActionArea>

              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  variant="h6"
                  fontWeight={900}
                  lineHeight={1.25}
                >
                  {course.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    minHeight: 42,
                  }}
                >
                  {course.description}
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: 2,
                    color: "text.secondary",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                  >
                    <Group sx={{ fontSize: 17 }} />

                    <Typography variant="caption">
                      {course.students}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                  >
                    <MenuBook sx={{ fontSize: 17 }} />

                    <Typography variant="caption">
                      {course.lessons.length} lessons
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                  >
                    <Star
                      sx={{
                        fontSize: 17,
                        color: "#F59E0B",
                      }}
                    />

                    <Typography variant="caption">
                      {course.rating}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Progress */}
                <Box sx={{ mt: 2.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.75 }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={800}
                    >
                      Your progress
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {completed}/
                      {course.lessons.length}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    value={progress}
                    variant="determinate"
                    sx={{
                      height: 7,
                      borderRadius: 5,
                      background:
                        `${course.color}14`,
                      "& .MuiLinearProgress-bar": {
                        background: course.color,
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>

                {/* Next lesson */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    background: "action.hover",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={800}
                  >
                    NEXT LESSON
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={850}
                    sx={{ mt: 0.25 }}
                    noWrap
                  >
                    {nextLesson.title}
                  </Typography>
                </Paper>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() =>
                      openLesson(
                        course,
                        nextLesson
                      )
                    }
                    sx={{
                      borderRadius: 2,
                      fontWeight: 850,
                      background: course.color,
                      "&:hover": {
                        background: course.color,
                        filter: "brightness(.92)",
                      },
                    }}
                  >
                    Continue
                  </Button>

                  <Tooltip title="View curriculum">
                    <IconButton
                      onClick={() =>
                        openCourse(course)
                      }
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <MenuBook />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Empty state */}
      {!visibleCourses.length && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            mt: 2,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <MenuBook
            sx={{
              fontSize: 50,
              color: "text.secondary",
            }}
          />

          <Typography
            variant="h6"
            fontWeight={900}
            sx={{ mt: 1 }}
          >
            No courses found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Try another level or explore all courses.
          </Typography>

          <Button
            sx={{ mt: 2 }}
            onClick={() => setFilter("All courses")}
          >
            Show all courses
          </Button>
        </Paper>
      )}

      {/* Course curriculum drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "100%",
              sm: 480,
            },
          },
        }}
      >
        {selectedCourse && (
          <Box>
            <Box
              sx={{
                p: 2.5,
                color: "white",
                background: selectedCourse.color,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ opacity: 0.75 }}
                  >
                    COURSE
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={900}
                    sx={{ mt: 0.25 }}
                  >
                    {selectedCourse.name}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() =>
                    setDrawerOpen(false)
                  }
                  sx={{ color: "white" }}
                >
                  <Close />
                </IconButton>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "rgba(255,255,255,.75)",
                }}
              >
                {selectedCourse.description}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="caption">
                    Progress
                  </Typography>

                  <Typography
                    variant="caption"
                    fontWeight={900}
                  >
                    {getCourseProgress(selectedCourse)}%
                  </Typography>
                </Stack>

                <LinearProgress
                  value={getCourseProgress(
                    selectedCourse
                  )}
                  variant="determinate"
                  sx={{
                    mt: 0.75,
                    height: 7,
                    borderRadius: 5,
                    background:
                      "rgba(255,255,255,.15)",
                    "& .MuiLinearProgress-bar": {
                      background: "white",
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              <Typography
                variant="caption"
                fontWeight={900}
                color="text.secondary"
                letterSpacing={1}
              >
                LESSONS
              </Typography>

              <Stack sx={{ mt: 1 }}>
                {selectedCourse.lessons.map(
                  (lesson, index) => {
                    const completed =
                      lesson.completed ||
                      completedLessons[lesson.id];

                    return (
                      <Box
                        key={lesson.id}
                        onClick={() => {
                          if (lesson.locked) return;

                          openLesson(
                            selectedCourse,
                            lesson
                          );
                        }}
                        sx={{
                          p: 1.5,
                          display: "flex",
                          gap: 1.5,
                          alignItems: "center",
                          borderRadius: 2,
                          cursor: lesson.locked
                            ? "not-allowed"
                            : "pointer",
                          opacity: lesson.locked
                            ? 0.45
                            : 1,
                          "&:hover": {
                            background:
                              lesson.locked
                                ? "transparent"
                                : "action.hover",
                          },
                        }}
                      >
                        {completed ? (
                          <CheckCircle
                            sx={{
                              color:
                                "success.main",
                            }}
                          />
                        ) : lesson.locked ? (
                          <Lock />
                        ) : (
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 12,
                              bgcolor:
                                `${selectedCourse.color}14`,
                              color:
                                selectedCourse.color,
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        )}

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={800}
                          >
                            {lesson.title}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {lesson.duration}
                            </Typography>

                            {completed && (
                              <Typography
                                variant="caption"
                                color="success.main"
                                fontWeight={800}
                              >
                                Completed
                              </Typography>
                            )}
                          </Stack>
                        </Box>

                        {!lesson.locked && (
                          <ChevronRight
                            sx={{
                              color:
                                "text.secondary",
                            }}
                          />
                        )}
                      </Box>
                    );
                  }
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default Courses;