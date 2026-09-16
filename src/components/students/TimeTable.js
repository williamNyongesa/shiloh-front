import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  CalendarMonth,
  CheckCircle,
  Close,
  DeleteOutline,
  EditOutlined,
  EventAvailable,
  MeetingRoom,
  Person,
  Schedule,
} from "@mui/icons-material";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TIME_SLOTS = [
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
];

const SUBJECTS = [
  "Mathematics",
  "English",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Computer Science",
  "Art",
  "Geography",
  "Physical Education",
];

const initialTimetable = [
  {
    id: 1,
    day: "Monday",
    time: "9:00 AM - 10:00 AM",
    subject: "Mathematics",
    room: "Room 101",
    teacher: "Mr. Smith",
    class_id: "MATH-101",
  },
  {
    id: 2,
    day: "Monday",
    time: "10:00 AM - 11:00 AM",
    subject: "English",
    room: "Room 102",
    teacher: "Ms. Johnson",
    class_id: "ENG-102",
  },
  {
    id: 3,
    day: "Monday",
    time: "11:00 AM - 12:00 PM",
    subject: "Biology",
    room: "Room 103",
    teacher: "Dr. Brown",
    class_id: "BIO-103",
  },
  {
    id: 4,
    day: "Tuesday",
    time: "9:00 AM - 10:00 AM",
    subject: "History",
    room: "Room 101",
    teacher: "Mr. White",
    class_id: "HIS-101",
  },
  {
    id: 5,
    day: "Tuesday",
    time: "10:00 AM - 11:00 AM",
    subject: "Chemistry",
    room: "Room 102",
    teacher: "Mrs. Green",
    class_id: "CHEM-102",
  },
  {
    id: 6,
    day: "Wednesday",
    time: "9:00 AM - 10:00 AM",
    subject: "Physics",
    room: "Room 104",
    teacher: "Mr. Adams",
    class_id: "PHY-104",
  },
  {
    id: 7,
    day: "Wednesday",
    time: "10:00 AM - 11:00 AM",
    subject: "Mathematics",
    room: "Room 101",
    teacher: "Mr. Smith",
    class_id: "MATH-101",
  },
  {
    id: 8,
    day: "Thursday",
    time: "9:00 AM - 10:00 AM",
    subject: "Computer Science",
    room: "Room 105",
    teacher: "Ms. Lee",
    class_id: "CS-105",
  },
  {
    id: 9,
    day: "Thursday",
    time: "10:00 AM - 11:00 AM",
    subject: "Art",
    room: "Room 106",
    teacher: "Mr. Clark",
    class_id: "ART-106",
  },
  {
    id: 10,
    day: "Friday",
    time: "9:00 AM - 10:00 AM",
    subject: "Geography",
    room: "Room 103",
    teacher: "Mr. Harris",
    class_id: "GEO-103",
  },
  {
    id: 11,
    day: "Friday",
    time: "10:00 AM - 11:00 AM",
    subject: "Physical Education",
    room: "Gym",
    teacher: "Ms. Taylor",
    class_id: "PE-GYM",
  },
];

const emptyForm = {
  class_id: "",
  room_id: "",
  start_time: "",
  end_time: "",
  day_of_week: "Monday",
  subject: "",
  teacher: "",
  time: "9:00 AM - 10:00 AM",
};

const subjectColors = {
  Mathematics: "#5146e5",
  English: "#ef6c63",
  Biology: "#39a878",
  Chemistry: "#e5a83b",
  Physics: "#3b82c4",
  History: "#8b5cf6",
  "Computer Science": "#0f766e",
  Art: "#db5b9b",
  Geography: "#708238",
  "Physical Education": "#f97316",
};

function ScheduleClass() {
  const [classes, setClasses] = useState(initialTimetable);
  const [openModal, setOpenModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState("week");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const totalClasses = classes.length;
  const occupiedSlots = new Set(
    classes.map((item) => `${item.day}-${item.time}`)
  ).size;

  const completionRate = Math.round(
    (occupiedSlots / (DAYS.length * TIME_SLOTS.length)) * 100
  );

  const visibleDays = useMemo(() => {
    if (view === "day") return [selectedDay];
    return DAYS;
  }, [view, selectedDay]);

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openCreateModal = (day = "Monday", time = "9:00 AM - 10:00 AM") => {
    setEditingClass(null);
    setForm({
      ...emptyForm,
      day_of_week: day,
      time,
    });
    setOpenModal(true);
  };

  const openEditModal = (classItem) => {
    setEditingClass(classItem);
    setForm({
      class_id: classItem.class_id || "",
      room_id: classItem.room || "",
      start_time: "",
      end_time: "",
      day_of_week: classItem.day,
      subject: classItem.subject,
      teacher: classItem.teacher,
      time: classItem.time,
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingClass(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.class_id || !form.subject || !form.room_id || !form.teacher) {
      showMessage("Please complete all required fields.", "warning");
      return;
    }

    const classData = {
      id: editingClass?.id || Date.now(),
      class_id: form.class_id,
      room: form.room_id,
      subject: form.subject,
      teacher: form.teacher,
      day: form.day_of_week,
      time: form.time,
      start_time: form.start_time,
      end_time: form.end_time,
    };

    if (editingClass) {
      setClasses((current) =>
        current.map((item) =>
          item.id === editingClass.id ? classData : item
        )
      );
      showMessage("Class updated successfully.");
    } else {
      const conflict = classes.some(
        (item) =>
          item.day === classData.day && item.time === classData.time
      );

      if (conflict) {
        showMessage(
          "That time slot is already occupied. Choose another slot.",
          "warning"
        );
        return;
      }

      setClasses((current) => [...current, classData]);
      showMessage("Class added to the timetable.");
    }

    /*
      Persist to your API.

      Uncomment when the backend endpoint is ready:

      try {
        await axios.post(
          "https://shiloh-server-2t51.onrender.com/timetable",
          {
            class_id: classData.class_id,
            room_id: classData.room,
            start_time: classData.start_time,
            end_time: classData.end_time,
            day_of_week: classData.day,
          }
        );
      } catch (error) {
        console.error(error);
        showMessage("The class was saved locally, but the server request failed.", "warning");
      }
    */

    closeModal();
  };

  const handleDelete = (id) => {
    setClasses((current) => current.filter((item) => item.id !== id));
    showMessage("Class removed from the timetable.");
  };

  const handleSubmitSchedule = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await Promise.all(
        classes.map((item) =>
          axios.post(
            "https://shiloh-server-2t51.onrender.com/timetable",
            {
              class_id: item.class_id,
              room_id: item.room,
              start_time: item.start_time || null,
              end_time: item.end_time || null,
              day_of_week: item.day,
            },
            {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {},
            }
          )
        )
      );

      showMessage("Timetable published successfully.");
    } catch (error) {
      console.error(error);
      showMessage(
        "The timetable is ready, but the server could not be reached.",
        "warning"
      );
    }
  };

  const getClass = (day, time) =>
    classes.find((item) => item.day === day && item.time === time);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          mb: 4,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<CalendarMonth />}
              label="ACADEMIC PLANNER"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<CheckCircle />}
              label="Schedule active"
              color="success"
              size="small"
            />
          </Stack>

          <Typography
            variant="h3"
            sx={{
              mt: 1.5,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            Class timetable
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Organise lessons, rooms and teachers in one clear weekly view.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => openCreateModal()}
          >
            Add class
          </Button>

          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleSubmitSchedule}
          >
            Publish timetable
          </Button>
        </Stack>
      </Box>

      {/* SUMMARY CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Scheduled classes",
            value: totalClasses,
            icon: <EventAvailable />,
            color: "#5146e5",
          },
          {
            label: "Weekly capacity",
            value: `${completionRate}%`,
            icon: <AutoGraphIcon />,
            color: "#39a878",
          },
          {
            label: "Available slots",
            value: DAYS.length * TIME_SLOTS.length - occupiedSlots,
            icon: <Schedule />,
            color: "#e5a83b",
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 2,
              alignItems: "center",
              background:
                "linear-gradient(135deg, rgba(255,255,255,.98), rgba(247,247,252,.95))",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: `${stat.color}15`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={900}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* TOOLBAR */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {[
            ["week", "Week"],
            ["day", "Day"],
          ].map(([value, label]) => (
            <Button
              key={value}
              size="small"
              variant={view === value ? "contained" : "text"}
              onClick={() => setView(value)}
            >
              {label}
            </Button>
          ))}
        </Stack>

        {view === "day" && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Day</InputLabel>
            <Select
              value={selectedDay}
              label="Day"
              onChange={(event) => setSelectedDay(event.target.value)}
            >
              {DAYS.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Paper>

      {/* TIMETABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "auto",
        }}
      >
        <Box sx={{ minWidth: view === "week" ? 1050 : 650 }}>
          {/* DAY HEADER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `150px repeat(${visibleDays.length}, minmax(170px, 1fr))`,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
              <Typography
                variant="caption"
                fontWeight={900}
                color="text.secondary"
              >
                TIME
              </Typography>
            </Box>

            {visibleDays.map((day) => (
              <Box
                key={day}
                sx={{
                  p: 2,
                  borderLeft: "1px solid",
                  borderColor: "divider",
                  bgcolor: "#fafafa",
                }}
              >
                <Typography fontWeight={900}>{day}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {classes.filter((item) => item.day === day).length} classes
                </Typography>
              </Box>
            ))}
          </Box>

          {/* TIME ROWS */}
          {TIME_SLOTS.map((time) => (
            <Box
              key={time}
              sx={{
                display: "grid",
                gridTemplateColumns: `150px repeat(${visibleDays.length}, minmax(170px, 1fr))`,
                minHeight: 145,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  bgcolor: "#fcfcfd",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={800}
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  {time}
                </Typography>
              </Box>

              {visibleDays.map((day) => {
                const classItem = getClass(day, time);

                return (
                  <Box
                    key={`${day}-${time}`}
                    onClick={() =>
                      !classItem && openCreateModal(day, time)
                    }
                    sx={{
                      p: 1,
                      borderLeft: "1px solid",
                      borderColor: "divider",
                      bgcolor: classItem ? "#fff" : "#fafbfc",
                      cursor: classItem ? "default" : "pointer",
                      transition: "all .2s ease",
                      "&:hover": {
                        bgcolor: classItem ? "#fff" : "#f1f3f8",
                      },
                    }}
                  >
                    {classItem ? (
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          minHeight: 125,
                          p: 1.75,
                          borderRadius: 3,
                          border: `1px solid ${
                            subjectColors[classItem.subject] || "#5146e5"
                          }35`,
                          borderLeft: `4px solid ${
                            subjectColors[classItem.subject] || "#5146e5"
                          }`,
                          bgcolor: `${
                            subjectColors[classItem.subject] || "#5146e5"
                          }08`,
                          position: "relative",
                          transition: "all .2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 10px 25px rgba(20,20,40,.08)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Chip
                            size="small"
                            label={classItem.subject}
                            sx={{
                              fontWeight: 800,
                              bgcolor: `${subjectColors[classItem.subject] || "#5146e5"}18`,
                              color:
                                subjectColors[classItem.subject] ||
                                "#5146e5",
                            }}
                          />

                          <Stack direction="row">
                            <Tooltip title="Edit class">
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openEditModal(classItem);
                                }}
                              >
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete class">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(classItem.id);
                                }}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>

                        <Typography
                          fontWeight={900}
                          sx={{ mt: 1, fontSize: "0.95rem" }}
                        >
                          {classItem.class_id}
                        </Typography>

                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          <Stack direction="row" spacing={0.75}>
                            <MeetingRoom
                              sx={{
                                fontSize: 16,
                                color: "text.secondary",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {classItem.room}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.75}>
                            <Person
                              sx={{
                                fontSize: 16,
                                color: "text.secondary",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {classItem.teacher}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    ) : (
                      <Box
                        sx={{
                          height: "100%",
                          minHeight: 125,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px dashed",
                          borderColor: "divider",
                          borderRadius: 3,
                          opacity: 0,
                          transition: "opacity .2s",
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          <Add color="primary" />
                          <Typography
                            variant="caption"
                            color="primary"
                            fontWeight={800}
                          >
                            Add class
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={openModal}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 900,
          }}
        >
          {editingClass ? "Edit class" : "Add class"}

          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Class ID"
              placeholder="e.g. MATH-101"
              value={form.class_id}
              onChange={(e) => updateForm("class_id", e.target.value)}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Subject</InputLabel>
              <Select
                value={form.subject}
                label="Subject"
                onChange={(e) => updateForm("subject", e.target.value)}
              >
                {SUBJECTS.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={form.day_of_week}
                  label="Day"
                  onChange={(e) =>
                    updateForm("day_of_week", e.target.value)
                  }
                >
                  {DAYS.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Time</InputLabel>
                <Select
                  value={form.time}
                  label="Time"
                  onChange={(e) => updateForm("time", e.target.value)}
                >
                  {TIME_SLOTS.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Room"
                placeholder="Room 101"
                value={form.room_id}
                onChange={(e) =>
                  updateForm("room_id", e.target.value)
                }
                fullWidth
                required
              />

              <TextField
                label="Teacher"
                placeholder="Mr. Smith"
                value={form.teacher}
                onChange={(e) =>
                  updateForm("teacher", e.target.value)
                }
                fullWidth
                required
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start time"
                type="datetime-local"
                value={form.start_time}
                onChange={(e) =>
                  updateForm("start_time", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="End time"
                type="datetime-local"
                value={form.end_time}
                onChange={(e) =>
                  updateForm("end_time", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<CheckCircle />}
          >
            {editingClass ? "Save changes" : "Add class"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((current) => ({
            ...current,
            open: false,
          }))
        }
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Small icon wrapper so the stats section stays self-contained.
const AutoGraphIcon = () => (
  <TrendingUpIcon />
);

const TrendingUpIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 17l6-6 4 4 7-8" />
    <path d="M14 7h6v6" />
  </svg>
);

export default ScheduleClass;