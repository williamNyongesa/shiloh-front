import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  Assignment,
  CheckCircle,
  Close,
  CloudUpload,
  Description,
  Event,
  FilterList,
  KeyboardArrowRight,
  Search,
  Warning,
} from "@mui/icons-material";
import { getDemoUser } from "../../demoData";

const dummyAssignments = [
  {
    id: 1,
    title: "Build a Personal Budget",
    subject: "Mathematics",
    course: "Mathematics 101",
    description:
      "Create a monthly personal budget using percentages, income, expenses, and savings goals.",
    dueDate: "2026-09-14",
    status: "Pending",
    points: 100,
    progress: 65,
    priority: "High",
    estimatedTime: "45 min",
    instructions: [
      "Create a realistic monthly income.",
      "List at least five expenses.",
      "Calculate your savings percentage.",
      "Submit your completed worksheet.",
    ],
  },
  {
    id: 2,
    title: "Climate Change Research",
    subject: "Science",
    course: "Environmental Science",
    description:
      "Research one major effect of climate change and explain how it affects communities.",
    dueDate: "2026-09-17",
    status: "Pending",
    points: 150,
    progress: 20,
    priority: "Medium",
    estimatedTime: "1 hr 20 min",
    instructions: [
      "Choose one climate-related topic.",
      "Use at least three reliable sources.",
      "Write a 500-word report.",
      "Include a short conclusion.",
    ],
  },
  {
    id: 3,
    title: "Leadership Reflection",
    subject: "Communication",
    course: "Communication for Leaders",
    description:
      "Reflect on a leadership experience and identify three lessons that shaped your approach.",
    dueDate: "2026-09-12",
    status: "Submitted",
    points: 100,
    progress: 100,
    priority: "Low",
    estimatedTime: "30 min",
    instructions: [
      "Describe the situation.",
      "Explain your role.",
      "Identify three lessons.",
      "Submit your reflection.",
    ],
  },
  {
    id: 4,
    title: "Algorithm Challenge",
    subject: "Computer Science",
    course: "Foundations of Computer Science",
    description:
      "Solve three algorithm problems and explain your approach using pseudocode.",
    dueDate: "2026-09-19",
    status: "Pending",
    points: 200,
    progress: 40,
    priority: "High",
    estimatedTime: "2 hrs",
    instructions: [
      "Solve all three problems.",
      "Write pseudocode before coding.",
      "Explain your time complexity.",
      "Upload your final solution.",
    ],
  },
  {
    id: 5,
    title: "History Presentation",
    subject: "History",
    course: "World History",
    description:
      "Prepare a short presentation about an important historical event and its modern impact.",
    dueDate: "2026-09-23",
    status: "Pending",
    points: 120,
    progress: 0,
    priority: "Medium",
    estimatedTime: "1 hr",
    instructions: [
      "Select a historical event.",
      "Create 6–8 presentation slides.",
      "Include visual references.",
      "Present your findings clearly.",
    ],
  },
  {
    id: 6,
    title: "Creative Writing Exercise",
    subject: "English",
    course: "Academic Writing",
    description:
      "Write a 750-word short story using a clear beginning, conflict, and resolution.",
    dueDate: "2026-09-08",
    status: "Overdue",
    points: 100,
    progress: 55,
    priority: "High",
    estimatedTime: "1 hr",
    instructions: [
      "Write approximately 750 words.",
      "Use a clear narrative structure.",
      "Develop at least two characters.",
      "Proofread before submitting.",
    ],
  },
];

const statusConfig = {
  Pending: {
    label: "In progress",
    color: "primary",
    icon: <AccessTime fontSize="small" />,
  },
  Submitted: {
    label: "Submitted",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
  Overdue: {
    label: "Overdue",
    color: "error",
    icon: <Warning fontSize="small" />,
  },
};

const priorityColor = {
  High: "#ef5350",
  Medium: "#f59e0b",
  Low: "#10b981",
};

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("userDATA") || "null"
    );

    const demoAssignments = storedData?.demo
      ? getDemoUser("student").assignments
      : dummyAssignments;

    const normalized = demoAssignments.map((assignment) => ({
      ...assignment,
      status: assignment.status || "Pending",
      progress: assignment.progress ?? 0,
      points: assignment.points ?? 100,
      priority: assignment.priority || "Medium",
      estimatedTime: assignment.estimatedTime || "45 min",
    }));

    const timer = setTimeout(() => {
      setAssignments(normalized);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const subjects = useMemo(
    () => ["All", ...new Set(assignments.map((item) => item.subject).filter(Boolean))],
    [assignments]
  );

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        assignment.subject
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        assignment.course
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || assignment.status === statusFilter;

      const matchesSubject =
        subjectFilter === "All" ||
        assignment.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [assignments, search, statusFilter, subjectFilter]);

  const stats = useMemo(
    () => ({
      total: assignments.length,
      pending: assignments.filter((a) => a.status === "Pending").length,
      submitted: assignments.filter((a) => a.status === "Submitted").length,
      overdue: assignments.filter((a) => a.status === "Overdue").length,
    }),
    [assignments]
  );

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDueLabel = (assignment) => {
    if (assignment.status === "Submitted") return "Submitted";

    const due = new Date(`${assignment.dueDate}T23:59:59`);
    const today = new Date();

    if (due < today) return "Past due";

    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Due today";
    if (diff === 1) return "Due tomorrow";

    return `${diff} days left`;
  };

  const handleSubmit = () => {
    if (!selectedAssignment) return;

    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === selectedAssignment.id
          ? {
              ...assignment,
              status: "Submitted",
              progress: 100,
            }
          : assignment
      )
    );

    setSelectedAssignment((current) => ({
      ...current,
      status: "Submitted",
      progress: 100,
    }));
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSubjectFilter("All");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="text" width={250} height={55} />
        <Skeleton variant="text" width={420} height={30} sx={{ mb: 4 }} />

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton variant="rounded" height={260} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f8fc",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
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
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "primary.main",
              }}
            >
              YOUR WORKSPACE
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.04em",
                mt: 0.5,
              }}
            >
              Assignments
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Stay on top of your work and keep your learning momentum moving.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Assignment />}
            onClick={() =>
              document
                .getElementById("assignment-list")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1.2,
              fontWeight: 800,
            }}
          >
            View assignments
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "All assignments",
              value: stats.total,
              icon: <Assignment />,
              color: "#5146e5",
            },
            {
              label: "In progress",
              value: stats.pending,
              icon: <AccessTime />,
              color: "#3b82f6",
            },
            {
              label: "Submitted",
              value: stats.submitted,
              icon: <CheckCircle />,
              color: "#10b981",
            },
            {
              label: "Needs attention",
              value: stats.overdue,
              icon: <Warning />,
              color: "#ef5350",
            },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 2,
                  border: "1px solid #eaecf2",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>

                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #eaecf2",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ md: "center" }}
          >
            <TextField
              fullWidth
              placeholder="Search assignments, courses or subjects..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fafbfc",
                },
              }}
            />

            <FormControl sx={{ minWidth: { md: 160 } }}>
              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="All">All statuses</MenuItem>
                <MenuItem value="Pending">In progress</MenuItem>
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { md: 180 } }}>
              <Select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                displayEmpty
                sx={{ borderRadius: 3 }}
              >
                {subjects.map((subject) => (
                  <MenuItem value={subject} key={subject}>
                    {subject === "All" ? "All subjects" : subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(search ||
              statusFilter !== "All" ||
              subjectFilter !== "All") && (
              <Button onClick={resetFilters} sx={{ whiteSpace: "nowrap" }}>
                Clear filters
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Assignment list */}
        <Box id="assignment-list">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={900}>
                Your assignments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredAssignments.length} assignment
                {filteredAssignments.length === 1 ? "" : "s"} found
              </Typography>
            </Box>

            <Chip
              label={`${stats.pending} active`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {filteredAssignments.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                py: 8,
                textAlign: "center",
                borderRadius: 2,
                border: "1px solid #eaecf2",
              }}
            >
              <Avatar
                sx={{
                  mx: "auto",
                  mb: 2,
                  bgcolor: "#eeedff",
                  color: "primary.main",
                  width: 64,
                  height: 64,
                }}
              >
                <Search />
              </Avatar>

              <Typography variant="h6" fontWeight={900}>
                No assignments found
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Try changing your search or filters.
              </Typography>

              <Button onClick={resetFilters} sx={{ mt: 2 }}>
                Reset filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {filteredAssignments.map((assignment) => {
                const status =
                  statusConfig[assignment.status] || statusConfig.Pending;

                return (
                  <Grid item xs={12} md={6} key={assignment.id}>
                    <Paper
                      elevation={0}
                      onClick={() => setSelectedAssignment(assignment)}
                      sx={{
                        p: 2.5,
                        height: "100%",
                        borderRadius: 2,
                        border: "1px solid #eaecf2",
                        cursor: "pointer",
                        transition: "all .2s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            "0 16px 40px rgba(37, 42, 74, .10)",
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: 5,
                          height: "100%",
                          bgcolor: priorityColor[assignment.priority],
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={2}
                      >
                        <Stack direction="row" spacing={1.5}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              bgcolor: "#eeedff",
                              color: "primary.main",
                              width: 48,
                              height: 48,
                            }}
                          >
                            <Description />
                          </Avatar>

                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={900}
                              sx={{ lineHeight: 1.2 }}
                            >
                              {assignment.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {assignment.course || assignment.subject}
                            </Typography>
                          </Box>
                        </Stack>

                        <KeyboardArrowRight color="action" />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {assignment.description ||
                          "Complete this assignment and submit your work before the due date."}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mt: 2, gap: 0.5 }}
                      >
                        <Chip
                          size="small"
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                        />

                        <Chip
                          size="small"
                          icon={<Event />}
                          label={getDueLabel(assignment)}
                          variant="outlined"
                        />

                        <Chip
                          size="small"
                          label={`${assignment.points} pts`}
                          variant="outlined"
                        />
                      </Stack>

                      <Box sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={800}
                          >
                            Progress
                          </Typography>

                          <Typography
                            variant="caption"
                            fontWeight={800}
                            color="primary.main"
                          >
                            {assignment.progress}%
                          </Typography>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={assignment.progress}
                          sx={{
                            height: 7,
                            borderRadius: 10,
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Due {formatDate(assignment.dueDate)}
                          </Typography>

                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            {assignment.estimatedTime}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          endIcon={<KeyboardArrowRight />}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedAssignment(assignment);
                          }}
                        >
                          Open
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {/* Bottom learning tip */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            bgcolor: "#5146e5",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,.15)",
              color: "white",
            }}
          >
            <CheckCircle />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={900}>
              Keep your momentum going
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,.75)", mt: 0.25 }}
            >
              Completing one small assignment today can make tomorrow easier.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Assignment details dialog */}
      <Dialog
        open={Boolean(selectedAssignment)}
        onClose={() => setSelectedAssignment(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedAssignment && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  color="primary.main"
                  fontWeight={900}
                >
                  {selectedAssignment.subject}
                </Typography>

                <Typography variant="h5" fontWeight={900}>
                  {selectedAssignment.title}
                </Typography>
              </Box>

              <Button
                onClick={() => setSelectedAssignment(null)}
                sx={{ minWidth: 40 }}
              >
                <Close />
              </Button>
            </DialogTitle>

            <DialogContent dividers>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={
                    statusConfig[selectedAssignment.status]?.label ||
                    selectedAssignment.status
                  }
                  color={
                    statusConfig[selectedAssignment.status]?.color ||
                    "default"
                  }
                />

                <Chip
                  icon={<Event />}
                  label={`Due ${formatDate(selectedAssignment.dueDate)}`}
                  variant="outlined"
                />

                <Chip
                  label={`${selectedAssignment.points} points`}
                  variant="outlined"
                />
              </Stack>

              <Typography fontWeight={800}>About this assignment</Typography>

              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {selectedAssignment.description}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography fontWeight={800}>
                    Completion
                  </Typography>

                  <Typography fontWeight={900} color="primary.main">
                    {selectedAssignment.progress}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={selectedAssignment.progress}
                  sx={{ height: 8, borderRadius: 10 }}
                />
              </Box>

              <Typography fontWeight={800} sx={{ mt: 3, mb: 1 }}>
                What you need to do
              </Typography>

              <Stack spacing={1}>
                {(selectedAssignment.instructions || [
                  "Review the assignment requirements.",
                  "Complete your work.",
                  "Check your answers.",
                  "Submit before the deadline.",
                ]).map((instruction, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: 13,
                        bgcolor: "#eeedff",
                        color: "primary.main",
                      }}
                    >
                      {index + 1}
                    </Avatar>

                    <Typography variant="body2" sx={{ pt: 0.5 }}>
                      {instruction}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {selectedAssignment.status === "Overdue" && (
                <Alert severity="warning" sx={{ mt: 3 }}>
                  This assignment is past its due date. Submit it as soon as
                  possible to get back on track.
                </Alert>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setSelectedAssignment(null)}
                color="inherit"
              >
                Close
              </Button>

              {selectedAssignment.status !== "Submitted" && (
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={handleSubmit}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 800,
                  }}
                >
                  Submit assignment
                </Button>
              )}

              {selectedAssignment.status === "Submitted" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  disabled
                >
                  Submitted
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AssignmentsPage;