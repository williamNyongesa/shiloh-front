import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  CalendarMonth,
  CalendarToday,
  CheckCircle,
  Close,
  DeleteOutline,
  EditOutlined,
  Event,
  ExpandMore,
  LocationOn,
  People,
  Search,
  Schedule,
  Share,
  Star,
} from "@mui/icons-material";

import { getDemoUser } from "../../demoData";

/* -------------------------------------------------------------------------- */
/* Demo data                                                                  */
/* -------------------------------------------------------------------------- */

const fallbackEvents = [
  {
    id: "event-1",
    title: "Annual Science & Innovation Fair",
    date: "2026-09-18",
    time: "9:00 AM - 3:00 PM",
    location: "Main Science Hall",
    category: "Academic",
    description:
      "Explore student inventions, science projects, robotics demonstrations, and innovative solutions created by learners across the school.",
    organizer: "Science Department",
    attendees: 86,
    capacity: 150,
    featured: true,
  },
  {
    id: "event-2",
    title: "Inter-School Football Tournament",
    date: "2026-09-20",
    time: "10:00 AM - 4:00 PM",
    location: "School Sports Ground",
    category: "Sports",
    description:
      "Join us for an exciting day of football as our school hosts neighboring schools for the annual inter-school tournament.",
    organizer: "Sports Department",
    attendees: 142,
    capacity: 300,
    featured: true,
  },
  {
    id: "event-3",
    title: "Career & University Guidance Day",
    date: "2026-09-24",
    time: "8:30 AM - 1:00 PM",
    location: "Main Auditorium",
    category: "Career",
    description:
      "Meet university representatives, career advisors, and industry professionals and learn more about your options after graduation.",
    organizer: "Career Guidance Office",
    attendees: 118,
    capacity: 200,
    featured: false,
  },
  {
    id: "event-4",
    title: "Student Leadership Workshop",
    date: "2026-09-27",
    time: "9:00 AM - 12:30 PM",
    location: "Leadership Centre",
    category: "Leadership",
    description:
      "A practical leadership workshop covering communication, teamwork, conflict resolution, decision making, and responsible leadership.",
    organizer: "Student Affairs",
    attendees: 54,
    capacity: 80,
    featured: false,
  },
  {
    id: "event-5",
    title: "Creative Arts Showcase",
    date: "2026-10-02",
    time: "2:00 PM - 6:00 PM",
    location: "Performing Arts Theatre",
    category: "Arts",
    description:
      "Celebrate student creativity through music, drama, visual arts, dance, photography, and creative writing.",
    organizer: "Arts Department",
    attendees: 91,
    capacity: 180,
    featured: false,
  },
  {
    id: "event-6",
    title: "Parent & Student Community Day",
    date: "2026-10-10",
    time: "9:00 AM - 2:00 PM",
    location: "School Main Campus",
    category: "Community",
    description:
      "A family-friendly community day featuring games, food, student activities, clubs, performances, and opportunities to connect with the school community.",
    organizer: "School Administration",
    attendees: 210,
    capacity: 400,
    featured: false,
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const categoryColors = {
  Academic: "#5146e5",
  Sports: "#ef5350",
  Career: "#00897b",
  Leadership: "#8e24aa",
  Arts: "#fb8c00",
  Community: "#1976d2",
};

const formatDate = (date) => {
  if (!date) return "Date TBA";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMonth = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
  });
};

const formatDay = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).getDate();
};

const isUpcoming = (date) => {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(`${date}T00:00:00`);
  return eventDate >= today;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [rsvps, setRsvps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentEventRsvps") || "{}");
    } catch {
      return {};
    }
  });

  const [adminMode, setAdminMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormOpen, setEventFormOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ---------------------------------------------------------------------- */
  /* Fetch events                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const storedData = JSON.parse(
          localStorage.getItem("userDATA") || "null"
        );

        if (storedData?.demo) {
          const demoEvents = getDemoUser("student")?.events;

          setTimeout(() => {
            setEvents(
              Array.isArray(demoEvents) && demoEvents.length
                ? demoEvents
                : fallbackEvents
            );
            setLoading(false);
          }, 450);

          return;
        }

        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          "https://shiloh-server-2t51.onrender.com/events",
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        const apiEvents = Array.isArray(response.data)
          ? response.data
          : response.data?.events || [];

        setEvents(apiEvents.length ? apiEvents : fallbackEvents);
      } catch (error) {
        console.error("Error fetching events:", error);

        setEvents(fallbackEvents);

        setSnackbar({
          open: true,
          message: "Using demo events because the server is unavailable.",
          severity: "info",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Categories                                                             */
  /* ---------------------------------------------------------------------- */

  const categories = useMemo(() => {
    const unique = events
      .map((event) => event.category)
      .filter(Boolean);

    return ["All", ...new Set(unique)];
  }, [events]);

  /* ---------------------------------------------------------------------- */
  /* Filter events                                                          */
  /* ---------------------------------------------------------------------- */

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events
      .filter((event) => {
        const upcoming = isUpcoming(event.date);

        if (activeTab === 1 && !upcoming) return false;
        if (activeTab === 2 && upcoming) return false;

        if (
          category !== "All" &&
          (event.category || "General") !== category
        ) {
          return false;
        }

        if (!query) return true;

        return [
          event.title,
          event.description,
          event.location,
          event.organizer,
          event.category,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );
      })
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(a.date) - new Date(b.date);
      });
  }, [events, activeTab, search, category]);

  /* ---------------------------------------------------------------------- */
  /* RSVP                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleRSVP = (event) => {
    const nextValue = !rsvps[event.id];

    const updated = {
      ...rsvps,
      [event.id]: nextValue,
    };

    setRsvps(updated);

    localStorage.setItem("studentEventRsvps", JSON.stringify(updated));

    setSnackbar({
      open: true,
      message: nextValue
        ? `You're registered for ${event.title}.`
        : `Your RSVP for ${event.title} was cancelled.`,
      severity: nextValue ? "success" : "info",
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Calendar                                                                */
  /* ---------------------------------------------------------------------- */

  const addToCalendar = (event) => {
    const start = new Date(`${event.date}T09:00:00`);
    const end = new Date(`${event.date}T11:00:00`);

    const formatCalendarDate = (date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const calendarUrl =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(event.title)}` +
      `&dates=${formatCalendarDate(start)}/${formatCalendarDate(end)}` +
      `&details=${encodeURIComponent(event.description || "")}` +
      `&location=${encodeURIComponent(event.location || "")}`;

    window.open(calendarUrl, "_blank", "noopener,noreferrer");

    setSnackbar({
      open: true,
      message: "Opening Google Calendar...",
      severity: "success",
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Share                                                                   */
  /* ---------------------------------------------------------------------- */

  const shareEvent = async (event) => {
    const shareData = {
      title: event.title,
      text: `${event.title} · ${formatDate(event.date)} · ${event.location}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${event.title} — ${formatDate(event.date)} — ${event.location}`
        );

        setSnackbar({
          open: true,
          message: "Event information copied to clipboard.",
          severity: "success",
        });
      }
    } catch (error) {
      console.log("Share cancelled.");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleDeleteEvent = async (eventId) => {
    const storedData = JSON.parse(
      localStorage.getItem("userDATA") || "null"
    );

    if (storedData?.demo) {
      setEvents((previous) =>
        previous.filter((event) => event.id !== eventId)
      );

      setSnackbar({
        open: true,
        message: "Demo event deleted.",
        severity: "success",
      });

      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(
        `https://shiloh-server-2t51.onrender.com/events/${eventId}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      setEvents((previous) =>
        previous.filter((event) => event.id !== eventId)
      );

      setSnackbar({
        open: true,
        message: "Event deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting event:", error);

      setSnackbar({
        open: true,
        message: "Unable to delete this event.",
        severity: "error",
      });
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Create/update event                                                     */
  /* ---------------------------------------------------------------------- */

  const emptyEvent = {
    title: "",
    date: "",
    time: "",
    location: "",
    category: "Academic",
    description: "",
    organizer: "School Administration",
  };

  const [eventForm, setEventForm] = useState(emptyEvent);

  const openCreateEvent = () => {
    setEditingEvent(null);
    setEventForm(emptyEvent);
    setEventFormOpen(true);
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      category: event.category || "Academic",
      description: event.description || "",
      organizer: event.organizer || "School Administration",
    });

    setEventFormOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      setSnackbar({
        open: true,
        message: "Please provide an event title and date.",
        severity: "warning",
      });

      return;
    }

    const storedData = JSON.parse(
      localStorage.getItem("userDATA") || "null"
    );

    /* Demo mode */
    if (storedData?.demo) {
      if (editingEvent) {
        setEvents((previous) =>
          previous.map((event) =>
            event.id === editingEvent.id
              ? {
                  ...event,
                  ...eventForm,
                }
              : event
          )
        );
      } else {
        const newEvent = {
          ...eventForm,
          id: `event-${Date.now()}`,
          attendees: 0,
          capacity: 100,
          featured: false,
        };

        setEvents((previous) => [...previous, newEvent]);
      }

      setEventFormOpen(false);

      setSnackbar({
        open: true,
        message: editingEvent
          ? "Event updated successfully."
          : "Event created successfully.",
        severity: "success",
      });

      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      if (editingEvent) {
        const response = await axios.put(
          `https://shiloh-server-2t51.onrender.com/events/${editingEvent.id}`,
          eventForm,
          { headers }
        );

        const updatedEvent = response.data?.event || response.data;

        setEvents((previous) =>
          previous.map((event) =>
            event.id === editingEvent.id ? updatedEvent : event
          )
        );
      } else {
        const response = await axios.post(
          "https://shiloh-server-2t51.onrender.com/events/submit-event",
          eventForm,
          { headers }
        );

        const newEvent = response.data?.event || response.data;

        setEvents((previous) => [...previous, newEvent]);
      }

      setEventFormOpen(false);

      setSnackbar({
        open: true,
        message: editingEvent
          ? "Event updated successfully."
          : "Event created successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving event:", error);

      setSnackbar({
        open: true,
        message: "Unable to save the event.",
        severity: "error",
      });
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton width={280} height={55} />
        <Skeleton width={450} height={25} sx={{ mb: 4 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <Card
              key={item}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Skeleton variant="rectangular" height={180} />
              <CardContent>
                <Skeleton width="70%" height={30} />
                <Skeleton width="90%" />
                <Skeleton width="60%" />
                <Skeleton width="100%" height={45} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 2,
          flexDirection: {
            xs: "column",
            md: "row",
          },
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            SCHOOL COMMUNITY
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: -1,
              mb: 1,
            }}
          >
            Events & activities
          </Typography>

          <Typography color="text.secondary">
            Stay connected with everything happening around your school.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateEvent}
          sx={{
            borderRadius: 3,
            px: 2.5,
            py: 1.25,
            fontWeight: 800,
          }}
        >
          Create event
        </Button>
      </Box>

      {/* Featured event */}
      {events.find((event) => event.featured && isUpcoming(event.date)) && (
        <Card
          sx={{
            mb: 4,
            borderRadius: 2,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #5146e5 0%, #756cf0 55%, #9b96ff 100%)",
            color: "white",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {(() => {
              const featured = events.find(
                (event) => event.featured && isUpcoming(event.date)
              );

              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 4,
                    alignItems: "center",
                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Chip
                      icon={<Star />}
                      label="Featured event"
                      sx={{
                        mb: 2,
                        color: "white",
                        bgcolor: "rgba(255,255,255,.16)",
                        fontWeight: 800,
                      }}
                    />

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        mb: 1.5,
                      }}
                    >
                      {featured.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(255,255,255,.82)",
                        maxWidth: 650,
                        mb: 2.5,
                      }}
                    >
                      {featured.description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Chip
                        icon={<CalendarToday />}
                        label={formatDate(featured.date)}
                        sx={{
                          bgcolor: "rgba(255,255,255,.14)",
                          color: "white",
                        }}
                      />

                      <Chip
                        icon={<LocationOn />}
                        label={featured.location}
                        sx={{
                          bgcolor: "rgba(255,255,255,.14)",
                          color: "white",
                        }}
                      />
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedEvent(featured);
                        setDetailsOpen(true);
                      }}
                      sx={{
                        mt: 3,
                        bgcolor: "white",
                        color: "#5146e5",
                        fontWeight: 800,
                        borderRadius: 3,
                        "&:hover": {
                          bgcolor: "#f4f3ff",
                        },
                      }}
                    >
                      View event
                    </Button>
                  </Box>

                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: 5,
                      bgcolor: "rgba(255,255,255,.14)",
                      fontSize: 64,
                    }}
                  >
                    <Event fontSize="inherit" />
                  </Avatar>
                </Box>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Search / filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: {
            xs: "column",
            md: "row",
          },
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search events, locations, departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
        />

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{
            minWidth: {
              xs: "100%",
              md: 190,
            },
            borderRadius: 3,
          }}
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All events" />
          <Tab label="Upcoming" />
          <Tab label="Past events" />
        </Tabs>
      </Box>

      {/* Results */}
      {filteredEvents.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              mb: 2,
              width: 64,
              height: 64,
              bgcolor: "primary.50",
              color: "primary.main",
            }}
          >
            <Event />
          </Avatar>

          <Typography variant="h6" fontWeight={800}>
            No events found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try changing your search or category filter.
          </Typography>

          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setSearch("");
              setCategory("All");
              setActiveTab(0);
            }}
          >
            Clear filters
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {filteredEvents.map((event) => {
            const color =
              categoryColors[event.category] || "#5146e5";

            const registered = Boolean(rsvps[event.id]);

            return (
              <Card
                key={event.id}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all .2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 14px 35px rgba(0,0,0,.10)",
                  },
                }}
              >
                {/* Card top */}
                <Box
                  sx={{
                    minHeight: 165,
                    p: 3,
                    color: "white",
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 70,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,.16)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      >
                        {formatMonth(event.date)}
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          lineHeight: 1,
                          fontWeight: 900,
                        }}
                      >
                        {formatDay(event.date)}
                      </Typography>
                    </Box>

                    <Chip
                      label={event.category || "General"}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255,255,255,.15)",
                        fontWeight: 800,
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      mb: 1,
                    }}
                  >
                    {event.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 42,
                    }}
                  >
                    {event.description ||
                      "Join the school community for this upcoming event."}
                  </Typography>

                  <Stack spacing={1} sx={{ mt: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Schedule
                        sx={{
                          fontSize: 19,
                          color: "text.secondary",
                        }}
                      />

                      <Typography variant="body2">
                        {formatDate(event.date)}
                        {event.time ? ` · ${event.time}` : ""}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LocationOn
                        sx={{
                          fontSize: 19,
                          color: "text.secondary",
                        }}
                      />

                      <Typography variant="body2">
                        {event.location || "Location TBA"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <People
                        sx={{
                          fontSize: 19,
                          color: "text.secondary",
                        }}
                      />

                      <Typography variant="body2">
                        {event.attendees || 0} attending
                        {event.capacity
                          ? ` · ${event.capacity} capacity`
                          : ""}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailsOpen(true);
                      }}
                      sx={{
                        flex: 1,
                        borderRadius: 2.5,
                        fontWeight: 800,
                      }}
                    >
                      View details
                    </Button>

                    <Button
                      variant={registered ? "contained" : "outlined"}
                      color={registered ? "success" : "primary"}
                      onClick={() => handleRSVP(event)}
                      startIcon={
                        registered ? <CheckCircle /> : undefined
                      }
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 800,
                      }}
                    >
                      {registered ? "Going" : "RSVP"}
                    </Button>
                  </Box>

                  {adminMode && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<EditOutlined />}
                        onClick={() => openEditEvent(event)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Event details dialog                                               */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {selectedEvent && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 900,
                pr: 6,
              }}
            >
              {selectedEvent.title}

              <IconButton
                onClick={() => setDetailsOpen(false)}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        categoryColors[selectedEvent.category] ||
                        "primary.main",
                    }}
                  >
                    <Event />
                  </Avatar>

                  <Box>
                    <Typography fontWeight={800}>
                      {formatDate(selectedEvent.date)}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {selectedEvent.time || "Time TBA"}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Location
                  </Typography>

                  <Typography fontWeight={700}>
                    {selectedEvent.location || "Location TBA"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Organized by
                  </Typography>

                  <Typography fontWeight={700}>
                    {selectedEvent.organizer ||
                      "School Administration"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.75 }}
                  >
                    About this event
                  </Typography>

                  <Typography>
                    {selectedEvent.description ||
                      "More information will be available soon."}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<People />}
                    label={`${selectedEvent.attendees || 0} attending`}
                  />

                  {selectedEvent.capacity && (
                    <Chip
                      label={`${selectedEvent.capacity} seats`}
                      variant="outlined"
                    />
                  )}

                  <Chip
                    label={
                      selectedEvent.category || "General"
                    }
                    variant="outlined"
                  />
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                p: 2,
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                startIcon={<Share />}
                onClick={() => shareEvent(selectedEvent)}
              >
                Share
              </Button>

              <Button
                startIcon={<CalendarMonth />}
                onClick={() => addToCalendar(selectedEvent)}
              >
                Add to calendar
              </Button>

              <Button
                variant="contained"
                startIcon={
                  rsvps[selectedEvent.id] ? (
                    <CheckCircle />
                  ) : null
                }
                color={
                  rsvps[selectedEvent.id]
                    ? "success"
                    : "primary"
                }
                onClick={() => handleRSVP(selectedEvent)}
              >
                {rsvps[selectedEvent.id]
                  ? "You're going"
                  : "RSVP"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/* Create / edit dialog                                               */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={eventFormOpen}
        onClose={() => setEventFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {editingEvent ? "Edit event" : "Create event"}

          <IconButton
            onClick={() => setEventFormOpen(false)}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Event title"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  title: e.target.value,
                })
              }
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
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    date: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Time"
                placeholder="9:00 AM - 12:00 PM"
                value={eventForm.time}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    time: e.target.value,
                  })
                }
              />
            </Box>

            <TextField
              fullWidth
              label="Location"
              value={eventForm.location}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  location: e.target.value,
                })
              }
            />

            <TextField
              select
              fullWidth
              label="Category"
              value={eventForm.category}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  category: e.target.value,
                })
              }
            >
              {Object.keys(categoryColors).map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Organizer"
              value={eventForm.organizer}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  organizer: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  description: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEventFormOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveEvent}
            startIcon={<CheckCircle />}
          >
            {editingEvent ? "Save changes" : "Create event"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/* Snackbar                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventsPage;