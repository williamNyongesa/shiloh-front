import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Modal,
  TextField,
  IconButton,
  Stack,
  Chip,
  Avatar,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  LinearProgress,
} from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import {
  AccessTime,
  Add,
  ArrowForward,
  Assignment,
  Book,
  CalendarMonth,
  CheckCircle,
  Close,
  Delete,
  Edit,
  Event,
  Groups,
  MenuBook,
  PlayArrow,
  Quiz,
  Search,
  Schedule,
  School,
  Today,
  VideoCall,
} from "@mui/icons-material";

import { getDemoUser } from "../../demoData";

const EVENT_TYPES = {
  lesson: {
    label: "Lesson",
    color: "#5146e5",
    icon: <MenuBook fontSize="small" />,
  },
  assignment: {
    label: "Assignment",
    color: "#f26b5e",
    icon: <Assignment fontSize="small" />,
  },
  quiz: {
    label: "Quiz",
    color: "#e7a33e",
    icon: <Quiz fontSize="small" />,
  },
  live: {
    label: "Live class",
    color: "#4fbf9f",
    icon: <VideoCall fontSize="small" />,
  },
  event: {
    label: "Event",
    color: "#64748b",
    icon: <Event fontSize="small" />,
  },
};

const DEMO_EVENTS = [
  {
    id: "lesson-1",
    title: "Foundations of Computer Science",
    type: "lesson",
    course: "Foundations of Computer Science",
    room: "Room A1",
    start: "2026-09-10T09:00:00",
    end: "2026-09-10T10:30:00",
    description:
      "Continue your journey through algorithms, flowcharts and computational thinking.",
    instructor: "Dr. Sarah Williams",
    location: "Room A1",
    action: "Join lesson",
  },
  {
    id: "quiz-1",
    title: "Algorithms Quiz",
    type: "quiz",
    course: "Foundations of Computer Science",
    start: "2026-09-10T14:00:00",
    end: "2026-09-10T14:30:00",
    description:
      "Test your understanding of algorithms, variables and basic flow control.",
    instructor: "Dr. Sarah Williams",
    location: "Online",
    action: "Start quiz",
  },
  {
    id: "assignment-1",
    title: "Communication Notes",
    type: "assignment",
    course: "Communication for Leaders",
    start: "2026-09-11T23:59:00",
    end: "2026-09-12T00:00:00",
    description:
      "Submit your reflection notes from the latest communication workshop.",
    instructor: "Mr. David Morgan",
    location: "Online submission",
    action: "View assignment",
  },
  {
    id: "live-1",
    title: "Creative Problem Solving Workshop",
    type: "live",
    course: "Creative Problem Solving",
    start: "2026-09-12T11:00:00",
    end: "2026-09-12T12:30:00",
    description:
      "Interactive workshop focused on reframing problems and generating better questions.",
    instructor: "Ms. Amara Johnson",
    location: "Virtual classroom",
    action: "Join class",
  },
  {
    id: "lesson-2",
    title: "Communication for Leaders",
    type: "lesson",
    course: "Communication for Leaders",
    start: "2026-09-14T10:00:00",
    end: "2026-09-14T11:30:00",
    description:
      "Explore active listening, presentation structure and persuasive communication.",
    instructor: "Mr. David Morgan",
    location: "Room B2",
    action: "Join lesson",
  },
  {
    id: "quiz-2",
    title: "Leadership Communication Quiz",
    type: "quiz",
    course: "Communication for Leaders",
    start: "2026-09-15T13:00:00",
    end: "2026-09-15T13:30:00",
    description:
      "A short assessment covering the communication principles from this week's lessons.",
    instructor: "Mr. David Morgan",
    location: "Online",
    action: "Start quiz",
  },
  {
    id: "assignment-2",
    title: "Problem Solving Reflection",
    type: "assignment",
    course: "Creative Problem Solving",
    start: "2026-09-16T23:59:00",
    end: "2026-09-17T00:00:00",
    description:
      "Write a 500-word reflection on a real-world problem and how you reframed it.",
    instructor: "Ms. Amara Johnson",
    location: "Online submission",
    action: "View assignment",
  },
  {
    id: "live-2",
    title: "Study Skills Live Session",
    type: "live",
    course: "Student Success",
    start: "2026-09-17T16:00:00",
    end: "2026-09-17T17:00:00",
    description:
      "Learn practical techniques for revision, focus and preparing for assessments.",
    instructor: "Learning Support Team",
    location: "Virtual classroom",
    action: "Join class",
  },
];

const SchoolCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    title: "",
    type: "lesson",
    course: "",
    start: "",
    end: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("userDATA") || "null"
    );

    if (storedData?.demo) {
      const demoEvents = getDemoUser("student")?.calendarEvents;

      if (Array.isArray(demoEvents) && demoEvents.length) {
        setEvents(
          demoEvents.map((event, index) => normalizeEvent(event, index))
        );
        return;
      }
    }

    setEvents(DEMO_EVENTS);
  }, []);

  const normalizeEvent = (event, index) => {
    const type = event.type || guessEventType(event.title);

    return {
      ...event,
      id: event.id || `event-${index}`,
      title:
        event.title ||
        event.class_name ||
        "Learning event",
      type,
      start: event.start || event.start_time,
      end: event.end || event.end_time,
      course: event.course || event.class_name || "General",
      location: event.location || event.room_number || "Online",
    };
  };

  const guessEventType = (title = "") => {
    const value = title.toLowerCase();

    if (value.includes("quiz") || value.includes("test")) return "quiz";
    if (
      value.includes("assignment") ||
      value.includes("submission") ||
      value.includes("project")
    ) {
      return "assignment";
    }

    if (
      value.includes("live") ||
      value.includes("workshop") ||
      value.includes("session")
    ) {
      return "live";
    }

    return "lesson";
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesType =
        filter === "all" || event.type === filter;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        event.title?.toLowerCase().includes(searchValue) ||
        event.course?.toLowerCase().includes(searchValue) ||
        event.instructor?.toLowerCase().includes(searchValue);

      return matchesType && matchesSearch;
    });
  }, [events, filter, search]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((event) => new Date(event.start) >= new Date())
      .sort(
        (a, b) =>
          new Date(a.start).getTime() -
          new Date(b.start).getTime()
      )
      .slice(0, 4);
  }, [events]);

  const todayEvents = useMemo(() => {
    const today = new Date();

    return events.filter((event) => {
      const eventDate = new Date(event.start);

      return (
        eventDate.getFullYear() === today.getFullYear() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getDate() === today.getDate()
      );
    });
  }, [events]);

  const openCreateModal = (date = "") => {
    setSelectedEvent(null);

    setForm({
      title: "",
      type: "lesson",
      course: "",
      start: date ? `${date}T09:00` : "",
      end: date ? `${date}T10:00` : "",
      location: "",
      description: "",
    });

    setOpenModal(true);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);

    setForm({
      title: event.title || "",
      type: event.type || "lesson",
      course: event.course || "",
      start: event.start
        ? event.start.slice(0, 16)
        : "",
      end: event.end
        ? event.end.slice(0, 16)
        : "",
      location: event.location || "",
      description: event.description || "",
    });

    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const handleFormChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const saveEvent = () => {
    if (!form.title || !form.start) return;

    const typeConfig =
      EVENT_TYPES[form.type] || EVENT_TYPES.lesson;

    const newEvent = {
      id:
        selectedEvent?.id ||
        `custom-${Date.now()}`,
      ...form,
      backgroundColor: typeConfig.color,
      borderColor: typeConfig.color,
      textColor: "#ffffff",
    };

    setEvents((previous) => {
      if (selectedEvent) {
        return previous.map((event) =>
          event.id === selectedEvent.id
            ? newEvent
            : event
        );
      }

      return [...previous, newEvent];
    });

    closeModal();
  };

  const deleteEvent = () => {
    if (!selectedEvent) return;

    setEvents((previous) =>
      previous.filter(
        (event) => event.id !== selectedEvent.id
      )
    );

    closeModal();
  };

  const handleCalendarEventClick = (info) => {
    const event = events.find(
      (item) => item.id === info.event.id
    );

    if (event) {
      openEventModal(event);
    }
  };

  const handleDateClick = (info) => {
    openCreateModal(info.dateStr);
  };

  const handleQuickAction = (event) => {
    if (event.type === "quiz") {
      window.location.href = "/student/quizzes";
      return;
    }

    if (event.type === "assignment") {
      window.location.href = "/student/assignments";
      return;
    }

    if (event.type === "live") {
      window.alert(
        "Opening the virtual classroom..."
      );
      return;
    }

    window.location.href = "/student/courses";
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const eventType = selectedEvent
    ? EVENT_TYPES[selectedEvent.type] ||
      EVENT_TYPES.event
    : EVENT_TYPES.event;

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, md: 4 },
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 900,
              letterSpacing: 1.5,
              fontSize: 12,
            }}
          >
            YOUR LEARNING PLANNER
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: -1.5,
              mt: 0.5,
            }}
          >
            School calendar
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.75 }}
          >
            Keep lessons, quizzes and deadlines in one place.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => openCreateModal()}
          sx={{
            borderRadius: 3,
            px: 2.5,
            py: 1.3,
            fontWeight: 800,
          }}
        >
          Add event
        </Button>
      </Box>

      {/* STATS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 1.5,
          mb: 3,
        }}
      >
        {[
          {
            label: "Today",
            value: todayEvents.length,
            icon: <Today />,
            color: "#5146e5",
          },
          {
            label: "Upcoming",
            value: upcomingEvents.length,
            icon: <Schedule />,
            color: "#4fbf9f",
          },
          {
            label: "Quizzes",
            value: events.filter(
              (event) => event.type === "quiz"
            ).length,
            icon: <Quiz />,
            color: "#e7a33e",
          },
          {
            label: "Assignments",
            value: events.filter(
              (event) => event.type === "assignment"
            ).length,
            icon: <Assignment />,
            color: "#f26b5e",
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: `${stat.color}16`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight={900}
              >
                {stat.value}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {stat.label}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* UPCOMING */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 2, md: 2.5 },
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={900}>
              Coming up
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Your next learning moments
            </Typography>
          </Box>

          <CalendarMonth color="primary" />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 1.5,
          }}
        >
          {upcomingEvents.map((event) => {
            const config =
              EVENT_TYPES[event.type] ||
              EVENT_TYPES.event;

            return (
              <Box
                key={event.id}
                onClick={() =>
                  openEventModal(event)
                }
                sx={{
                  p: 1.75,
                  borderRadius: 3,
                  background: `${config.color}09`,
                  border: "1px solid",
                  borderColor: `${config.color}25`,
                  cursor: "pointer",
                  transition: "all .2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 12px 28px ${config.color}18`,
                    borderColor: config.color,
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={1}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: `${config.color}18`,
                      color: config.color,
                    }}
                  >
                    {config.icon}
                  </Avatar>

                  <Chip
                    size="small"
                    label={config.label}
                    sx={{
                      bgcolor: `${config.color}12`,
                      color: config.color,
                      fontWeight: 800,
                    }}
                  />
                </Stack>

                <Typography
                  fontWeight={900}
                  noWrap
                >
                  {event.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {formatDate(event.start)} ·{" "}
                  {formatTime(event.start)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* FILTER BAR */}
      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          mb: 2,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search lessons, quizzes..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          sx={{
            minWidth: { xs: "100%", md: 260 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          {[
            ["all", "Everything"],
            ["lesson", "Lessons"],
            ["quiz", "Quizzes"],
            ["assignment", "Assignments"],
            ["live", "Live classes"],
          ].map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              clickable
              color={
                filter === value
                  ? "primary"
                  : "default"
              }
              variant={
                filter === value
                  ? "filled"
                  : "outlined"
              }
              onClick={() => setFilter(value)}
            />
          ))}
        </Stack>
      </Paper>

      {/* CALENDAR */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          p: { xs: 1, md: 2 },
          "& .fc": {
            "--fc-border-color":
              "rgba(100,116,139,.14)",
            "--fc-button-bg-color":
              "#5146e5",
            "--fc-button-border-color":
              "#5146e5",
            "--fc-button-hover-bg-color":
              "#4338ca",
            "--fc-button-hover-border-color":
              "#4338ca",
            "--fc-today-bg-color":
              "rgba(81,70,229,.06)",
            fontFamily: "inherit",
          },
          "& .fc-toolbar-title": {
            fontWeight: 900,
            fontSize: {
              xs: "1rem",
              md: "1.35rem",
            },
          },
          "& .fc-button": {
            borderRadius: "10px",
            fontWeight: 800,
            textTransform: "none",
          },
          "& .fc-daygrid-day-number": {
            fontWeight: 700,
          },
          "& .fc-event": {
            borderRadius: "7px",
            padding: "3px 5px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
          },
          "& .fc-list-event": {
            cursor: "pointer",
          },
        }}
      >
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView="dayGridMonth"
          height="auto"
          contentHeight={680}
          events={filteredEvents.map((event) => {
            const config =
              EVENT_TYPES[event.type] ||
              EVENT_TYPES.event;

            return {
              ...event,
              backgroundColor: config.color,
              borderColor: config.color,
              textColor: "#ffffff",
            };
          })}
          editable
          selectable
          eventClick={handleCalendarEventClick}
          dateClick={handleDateClick}
          eventDrop={(info) => {
            setEvents((previous) =>
              previous.map((event) =>
                event.id === info.event.id
                  ? {
                      ...event,
                      start:
                        info.event.start?.toISOString(),
                      end:
                        info.event.end?.toISOString(),
                    }
                  : event
              )
            );
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right:
              "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "Agenda",
          }}
          nowIndicator
          dayMaxEvents
          weekends
        />
      </Paper>

      {/* LEGEND */}
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        sx={{ mt: 2 }}
      >
        {Object.entries(EVENT_TYPES).map(
          ([key, config]) => (
            <Chip
              key={key}
              size="small"
              icon={config.icon}
              label={config.label}
              sx={{
                bgcolor: `${config.color}10`,
                color: config.color,
                fontWeight: 800,
              }}
            />
          )
        )}
      </Stack>

      {/* EVENT MODAL */}
      <Modal
        open={openModal}
        onClose={closeModal}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "calc(100% - 28px)",
              sm: 560,
            },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 5,
            boxShadow: 30,
            p: { xs: 2.5, md: 3 },
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                className="eyebrow"
                sx={{
                  color: "primary.main",
                  fontWeight: 900,
                  fontSize: 11,
                  letterSpacing: 1.2,
                }}
              >
                {selectedEvent
                  ? "LEARNING EVENT"
                  : "NEW EVENT"}
              </Typography>

              <Typography
                variant="h5"
                fontWeight={900}
                sx={{ mt: 0.5 }}
              >
                {selectedEvent
                  ? selectedEvent.title
                  : "Create an event"}
              </Typography>
            </Box>

            <IconButton onClick={closeModal}>
              <Close />
            </IconButton>
          </Box>

          {selectedEvent ? (
            <>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ mb: 2 }}
              >
                <Chip
                  icon={eventType.icon}
                  label={eventType.label}
                  sx={{
                    bgcolor: `${eventType.color}12`,
                    color: eventType.color,
                    fontWeight: 900,
                  }}
                />

                {selectedEvent.course && (
                  <Chip
                    icon={<Book />}
                    label={selectedEvent.course}
                    variant="outlined"
                  />
                )}
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  mb: 2,
                }}
              >
                <InfoRow
                  icon={<Schedule />}
                  label="When"
                  value={`${formatDate(
                    selectedEvent.start
                  )} · ${formatTime(
                    selectedEvent.start
                  )}${
                    selectedEvent.end
                      ? ` – ${formatTime(
                          selectedEvent.end
                        )}`
                      : ""
                  }`}
                />

                <InfoRow
                  icon={<School />}
                  label="Instructor"
                  value={
                    selectedEvent.instructor ||
                    "Learning team"
                  }
                />

                <InfoRow
                  icon={<Groups />}
                  label="Location"
                  value={
                    selectedEvent.location ||
                    "Online"
                  }
                />
              </Box>

              {selectedEvent.description && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "action.hover",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {selectedEvent.description}
                  </Typography>
                </Paper>
              )}

              <Divider sx={{ my: 2 }} />

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
              >
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    selectedEvent.type === "quiz" ? (
                      <Quiz />
                    ) : selectedEvent.type ===
                      "assignment" ? (
                      <Assignment />
                    ) : selectedEvent.type ===
                      "live" ? (
                      <VideoCall />
                    ) : (
                      <PlayArrow />
                    )
                  }
                  onClick={() =>
                    handleQuickAction(
                      selectedEvent
                    )
                  }
                >
                  {selectedEvent.action ||
                    "Open"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => {
                    // Keep modal open and switch to edit form.
                    setSelectedEvent({
                      ...selectedEvent,
                      editing: true,
                    });
                  }}
                >
                  Edit
                </Button>

                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={deleteEvent}
                >
                  Delete
                </Button>
              </Stack>
            </>
          ) : (
            <EventForm
              form={form}
              handleFormChange={handleFormChange}
              saveEvent={saveEvent}
              closeModal={closeModal}
            />
          )}

          {selectedEvent?.editing && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mb: 2 }}
              >
                Edit event
              </Typography>

              <EventForm
                form={form}
                handleFormChange={handleFormChange}
                saveEvent={saveEvent}
                closeModal={closeModal}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Avatar
      variant="rounded"
      sx={{
        width: 36,
        height: 36,
        bgcolor: "primary.main",
        color: "white",
      }}
    >
      {icon}
    </Avatar>

    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={700}
      >
        {label}
      </Typography>

      <Typography fontWeight={800}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const EventForm = ({
  form,
  handleFormChange,
  saveEvent,
  closeModal,
}) => (
  <Stack spacing={2}>
    <TextField
      label="Event title"
      value={form.title}
      onChange={handleFormChange("title")}
      fullWidth
      required
    />

    <FormControl fullWidth>
      <InputLabel>Event type</InputLabel>

      <Select
        value={form.type}
        label="Event type"
        onChange={handleFormChange("type")}
      >
        {Object.entries(EVENT_TYPES).map(
          ([key, config]) => (
            <MenuItem key={key} value={key}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                {config.icon}
                <span>{config.label}</span>
              </Stack>
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>

    <TextField
      label="Course"
      value={form.course}
      onChange={handleFormChange("course")}
      fullWidth
      placeholder="e.g. Foundations of Computer Science"
    />

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2,
      }}
    >
      <TextField
        label="Start"
        type="datetime-local"
        value={form.start}
        onChange={handleFormChange("start")}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="End"
        type="datetime-local"
        value={form.end}
        onChange={handleFormChange("end")}
        InputLabelProps={{ shrink: true }}
      />
    </Box>

    <TextField
      label="Location"
      value={form.location}
      onChange={handleFormChange("location")}
      fullWidth
      placeholder="Room A1 or Online"
    />

    <TextField
      label="Description"
      value={form.description}
      onChange={handleFormChange("description")}
      fullWidth
      multiline
      minRows={3}
    />

    <Stack
      direction="row"
      spacing={1}
      justifyContent="flex-end"
    >
      <Button onClick={closeModal}>
        Cancel
      </Button>

      <Button
        variant="contained"
        startIcon={<CheckCircle />}
        onClick={saveEvent}
        disabled={!form.title || !form.start}
      >
        Save event
      </Button>
    </Stack>
  </Stack>
);

export default SchoolCalendar;