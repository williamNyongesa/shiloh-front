import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

import {
  AddRounded,
  CalendarMonthRounded,
  CheckCircleOutlineRounded,
  CloseRounded,
  DeleteOutlineRounded,
  EditRounded,
  EventAvailableRounded,
  LocationOnOutlined,
  ScheduleRounded,
  TodayRounded,
} from "@mui/icons-material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getDemoUser } from "../../demoData";

const API_URL =
  "https://shiloh-server-2t51.onrender.com/calendar/events";

const DEMO_STORAGE_KEY = "shiloh_demo_calendar_events";

const SchoolCalendar = () => {
  const theme = useTheme();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [form, setForm] = useState({
    class_name: "",
    room_number: "",
    start_time: "",
    end_time: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isDemoMode = () => {
    try {
      const storedData = JSON.parse(
        localStorage.getItem("userDATA") || "null"
      );

      return Boolean(storedData?.demo);
    } catch {
      return false;
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  /*
   * Convert backend/demo event into FullCalendar format.
   */
  const normalizeEvent = (event) => ({
    id: String(event.id),
    title: event.class_name || event.title || "Untitled Class",
    start: event.start_time || event.start,
    end: event.end_time || event.end,
    extendedProps: {
      class_name:
        event.class_name ||
        event.title ||
        "Untitled Class",
      room_number:
        event.room_number ||
        event.location ||
        "Not assigned",
      original: event,
    },
  });

  /*
   * Convert FullCalendar event back into our application format.
   */
  const eventToRecord = (calendarEvent) => ({
    id: calendarEvent.id,
    class_name:
      calendarEvent.extendedProps?.class_name ||
      calendarEvent.title,
    room_number:
      calendarEvent.extendedProps?.room_number ||
      "Not assigned",
    start_time: calendarEvent.start
      ? formatDateTimeLocal(calendarEvent.start)
      : "",
    end_time: calendarEvent.end
      ? formatDateTimeLocal(calendarEvent.end)
      : "",
  });

  /*
   * Convert Date -> datetime-local compatible string.
   */
  const formatDateTimeLocal = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /*
   * Fetch calendar events.
   */
  const fetchEvents = useCallback(async () => {
    setLoading(true);

    try {
      if (isDemoMode()) {
        const storedDemoEvents = localStorage.getItem(
          DEMO_STORAGE_KEY
        );

        if (storedDemoEvents) {
          setEvents(JSON.parse(storedDemoEvents));
        } else {
          const demoEvents =
            getDemoUser("student")?.calendarEvents || [];

          const normalized = demoEvents.map((event) => ({
            id: String(event.id),
            title:
              event.title ||
              event.class_name ||
              "School Event",
            start:
              event.start ||
              event.start_time,
            end:
              event.end ||
              event.end_time,
            extendedProps: {
              class_name:
                event.class_name ||
                event.title ||
                "School Event",
              room_number:
                event.room_number ||
                event.location ||
                "Not assigned",
              original: event,
            },
          }));

          setEvents(normalized);

          localStorage.setItem(
            DEMO_STORAGE_KEY,
            JSON.stringify(normalized)
          );
        }

        return;
      }

      const token = localStorage.getItem("access_token");

      const response = await fetch(API_URL, {
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const normalized = Array.isArray(data)
        ? data.map(normalizeEvent)
        : [];

      setEvents(normalized);
    } catch (error) {
      console.error("Error fetching calendar events:", error);

      showSnackbar(
        "Unable to load calendar events.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /*
   * Persist demo events.
   */
  const persistDemoEvents = (updatedEvents) => {
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify(updatedEvents)
    );
  };

  /*
   * Reset form.
   */
  const resetForm = () => {
    setForm({
      class_name: "",
      room_number: "",
      start_time: "",
      end_time: "",
    });

    setFormErrors({});
    setSelectedEvent(null);
  };

  /*
   * Open create dialog.
   */
  const handleOpenCreate = (selection = null) => {
    resetForm();

    if (selection) {
      setForm({
        class_name: "",
        room_number: "",
        start_time: formatDateTimeLocal(
          selection.start
        ),
        end_time: formatDateTimeLocal(
          selection.end ||
            new Date(
              selection.start.getTime() + 60 * 60 * 1000
            )
        ),
      });
    }

    setOpenDialog(true);
  };

  /*
   * Open edit dialog.
   */
  const handleOpenEdit = (calendarEvent) => {
    const record = eventToRecord(calendarEvent);

    setSelectedEvent(record);

    setForm({
      class_name: record.class_name || "",
      room_number: record.room_number || "",
      start_time: record.start_time || "",
      end_time: record.end_time || "",
    });

    setFormErrors({});
    setOpenDialog(true);
  };

  /*
   * Close create/edit dialog.
   */
  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    resetForm();
  };

  /*
   * Form change.
   */
  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  /*
   * Validate event.
   */
  const validateForm = () => {
    const errors = {};

    if (!form.class_name.trim()) {
      errors.class_name = "Class name is required";
    }

    if (!form.room_number.trim()) {
      errors.room_number = "Room number is required";
    }

    if (!form.start_time) {
      errors.start_time = "Start time is required";
    }

    if (!form.end_time) {
      errors.end_time = "End time is required";
    }

    if (
      form.start_time &&
      form.end_time &&
      new Date(form.end_time) <= new Date(form.start_time)
    ) {
      errors.end_time =
        "End time must be after start time";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /*
   * CREATE / UPDATE
   */
  const handleSaveEvent = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      const payload = {
        class_name: form.class_name.trim(),
        room_number: form.room_number.trim(),
        start_time: form.start_time,
        end_time: form.end_time,
      };

      /*
       * DEMO MODE
       */
      if (isDemoMode()) {
        if (selectedEvent) {
          const updatedEvents = events.map((event) => {
            if (String(event.id) !== String(selectedEvent.id)) {
              return event;
            }

            return normalizeEvent({
              id: selectedEvent.id,
              ...payload,
            });
          });

          setEvents(updatedEvents);
          persistDemoEvents(updatedEvents);

          showSnackbar(
            "Calendar event updated successfully."
          );
        } else {
          const newEvent = normalizeEvent({
            id: `demo-${Date.now()}`,
            ...payload,
          });

          const updatedEvents = [
            ...events,
            newEvent,
          ];

          setEvents(updatedEvents);
          persistDemoEvents(updatedEvents);

          showSnackbar(
            "Calendar event created successfully."
          );
        }

        handleCloseDialog();
        return;
      }

      /*
       * PRODUCTION API
       */
      const token = localStorage.getItem("access_token");

      const url = selectedEvent
        ? `${API_URL}/${selectedEvent.id}`
        : API_URL;

      const response = await fetch(url, {
        method: selectedEvent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      const returnedEvent =
        result.event ||
        result.data ||
        result;

      if (selectedEvent) {
        setEvents((previous) =>
          previous.map((event) =>
            String(event.id) ===
            String(selectedEvent.id)
              ? normalizeEvent(returnedEvent)
              : event
          )
        );

        showSnackbar(
          result.message ||
            "Calendar event updated successfully."
        );
      } else {
        setEvents((previous) => [
          ...previous,
          normalizeEvent(returnedEvent),
        ]);

        showSnackbar(
          result.message ||
            "Calendar event created successfully."
        );
      }

      handleCloseDialog();
    } catch (error) {
      console.error(
        "Error saving calendar event:",
        error
      );

      showSnackbar(
        "Unable to save the calendar event.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Open delete confirmation.
   */
  const handleOpenDelete = (calendarEvent) => {
    const record = eventToRecord(calendarEvent);

    setSelectedEvent(record);
    setDeleteDialog(true);
  };

  /*
   * DELETE
   */
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    setDeleting(true);

    try {
      /*
       * DEMO MODE
       */
      if (isDemoMode()) {
        const updatedEvents = events.filter(
          (event) =>
            String(event.id) !==
            String(selectedEvent.id)
        );

        setEvents(updatedEvents);
        persistDemoEvents(updatedEvents);

        showSnackbar(
          "Calendar event deleted successfully."
        );

        setDeleteDialog(false);
        setSelectedEvent(null);

        return;
      }

      /*
       * PRODUCTION API
       */
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/${selectedEvent.id}`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      setEvents((previous) =>
        previous.filter(
          (event) =>
            String(event.id) !==
            String(selectedEvent.id)
        )
      );

      showSnackbar(
        result.message ||
          "Calendar event deleted successfully."
      );

      setDeleteDialog(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error(
        "Error deleting calendar event:",
        error
      );

      showSnackbar(
        "Unable to delete the calendar event.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
   * FullCalendar event click.
   */
  const handleEventClick = (info) => {
    handleOpenEdit(info.event);
  };

  /*
   * FullCalendar date selection.
   */
  const handleDateSelect = (selection) => {
    handleOpenCreate(selection);
  };

  /*
   * Calendar event render.
   */
  const renderEventContent = (eventInfo) => {
    const room =
      eventInfo.event.extendedProps?.room_number;

    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {eventInfo.event.title}
            </Typography>

            <Typography variant="caption">
              Room: {room}
            </Typography>
          </Box>
        }
        arrow
      >
        <Box
          sx={{
            px: 0.8,
            py: 0.35,
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {eventInfo.event.title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              opacity: 0.8,
              fontSize: "0.68rem",
            }}
          >
            {room}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  const todayCount = useMemo(() => {
    const today = new Date();

    return events.filter((event) => {
      if (!event.start) return false;

      const date = new Date(event.start);

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length;
  }, [events]);

  const upcomingCount = useMemo(() => {
    const now = new Date();

    return events.filter(
      (event) =>
        event.start &&
        new Date(event.start) >= now
    ).length;
  }, [events]);

  const totalRooms = useMemo(() => {
    return new Set(
      events
        .map(
          (event) =>
            event.extendedProps?.room_number
        )
        .filter(Boolean)
    ).size;
  }, [events]);

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: { xs: 2, md: 4 },
        background: (theme) =>
          `linear-gradient(
            135deg,
            ${alpha(
              theme.palette.primary.main,
              0.035
            )},
            transparent 45%,
            ${alpha(
              theme.palette.secondary.main,
              0.035
            )}
          )`,
      }}
    >
      <Container maxWidth="xl">
        {/* PAGE HEADER */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                background:
                  "linear-gradient(135deg, #3B82F6, #14B8A6)",
                boxShadow: (theme) =>
                  `0 10px 28px ${alpha(
                    theme.palette.primary.main,
                    0.25
                  )}`,
              }}
            >
              <CalendarMonthRounded />
            </Avatar>

            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.035em",
                  fontSize: {
                    xs: "1.7rem",
                    md: "2.25rem",
                  },
                }}
              >
                School Calendar
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Manage classes, schedules and rooms.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => handleOpenCreate()}
            sx={{
              minHeight: 46,
              px: 2.5,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 750,
              background:
                "linear-gradient(135deg, #3B82F6, #14B8A6)",
              boxShadow: (theme) =>
                `0 10px 25px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
            }}
          >
            Add Event
          </Button>
        </Stack>

        {/* STATISTICS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<EventAvailableRounded />}
              label="Total Events"
              value={events.length}
              color={theme.palette.primary.main}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<TodayRounded />}
              label="Today's Events"
              value={todayCount}
              color={theme.palette.success.main}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<LocationOnOutlined />}
              label="Rooms in Use"
              value={totalRooms}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        {/* CALENDAR */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            background: alpha(
              theme.palette.background.paper,
              0.9
            ),
            backdropFilter: "blur(16px)",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              spacing={1}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={750}
                >
                  Academic Schedule
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Select an empty date or click an event
                  to manage it.
                </Typography>
              </Box>

              <Chip
                icon={<CheckCircleOutlineRounded />}
                label={`${upcomingCount} upcoming`}
                color="success"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 650 }}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              p: { xs: 1, sm: 2, md: 3 },

              "& .fc": {
                "--fc-border-color": theme.palette.divider,
                "--fc-page-bg-color":
                  theme.palette.background.paper,
                "--fc-neutral-bg-color": alpha(
                  theme.palette.text.primary,
                  0.025
                ),
                "--fc-list-event-hover-bg-color":
                  alpha(
                    theme.palette.primary.main,
                    0.06
                  ),
              },

              "& .fc-toolbar": {
                gap: 1,
                flexWrap: "wrap",
              },

              "& .fc-toolbar-title": {
                fontSize: {
                  xs: "1.15rem",
                  md: "1.4rem",
                },
                fontWeight: 800,
              },

              "& .fc-button": {
                textTransform: "none",
                border: "none",
                borderRadius: "8px",
                fontWeight: 650,
                boxShadow: "none",
              },

              "& .fc-button-primary": {
                backgroundColor:
                  theme.palette.primary.main,
              },

              "& .fc-button-primary:hover": {
                backgroundColor:
                  theme.palette.primary.dark,
              },

              "& .fc-button-active": {
                backgroundColor:
                  theme.palette.secondary.main,
              },

              "& .fc-daygrid-day-number": {
                fontWeight: 650,
              },

              "& .fc-col-header-cell-cushion": {
                fontWeight: 700,
              },

              "& .fc-day-today": {
                backgroundColor: `${alpha(
                  theme.palette.primary.main,
                  0.06
                )} !important`,
              },

              "& .fc-event": {
                border: "none",
                borderRadius: "7px",
                background:
                  "linear-gradient(135deg, #3B82F6, #14B8A6)",
                boxShadow:
                  "0 3px 10px rgba(59,130,246,0.18)",
              },

              "& .fc-highlight": {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  0.1
                ),
              },

              "& .fc-daygrid-event": {
                padding: "2px",
              },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  height: {
                    xs: 500,
                    md: 700,
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack
                  alignItems="center"
                  spacing={2}
                >
                  <CalendarMonthRounded
                    sx={{
                      fontSize: 52,
                      color: "primary.main",
                    }}
                  />

                  <Typography
                    color="text.secondary"
                  >
                    Loading calendar...
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                ]}
                initialView="dayGridMonth"
                events={events}
                selectable
                selectMirror
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                height="auto"
                contentHeight="auto"
                dayMaxEvents={3}
                nowIndicator
                editable={false}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }}
                headerToolbar={{
                  start:
                    "today prev,next",
                  center: "title",
                  end:
                    "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                buttonText={{
                  today: "Today",
                  month: "Month",
                  week: "Week",
                  day: "Day",
                }}
              />
            )}
          </Box>
        </Card>

        {/* FOOTER INFO */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2.5,
            border: `1px solid ${theme.palette.divider}`,
            background: alpha(
              theme.palette.background.paper,
              0.65
            ),
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <ScheduleRounded
                fontSize="small"
                color="primary"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Click an event to edit or delete it.
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {events.length} scheduled event
              {events.length === 1 ? "" : "s"}
            </Typography>
          </Stack>
        </Paper>
      </Container>

      {/* CREATE / EDIT DIALOG */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: alpha(
              theme.palette.background.paper,
              0.96
            ),
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                {selectedEvent
                  ? "Edit Calendar Event"
                  : "Create Calendar Event"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.4 }}
              >
                {selectedEvent
                  ? "Update the class schedule and room."
                  : "Add a new class to the school schedule."}
              </Typography>
            </Box>

            <IconButton
              onClick={handleCloseDialog}
              disabled={saving}
            >
              <CloseRounded />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.2}>
            <TextField
              label="Class Name"
              placeholder="e.g. Mathematics 101"
              value={form.class_name}
              onChange={handleChange("class_name")}
              error={Boolean(formErrors.class_name)}
              helperText={formErrors.class_name}
              fullWidth
              autoFocus
            />

            <TextField
              label="Room Number"
              placeholder="e.g. A1"
              value={form.room_number}
              onChange={handleChange("room_number")}
              error={Boolean(formErrors.room_number)}
              helperText={formErrors.room_number}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Time"
                  type="datetime-local"
                  value={form.start_time}
                  onChange={handleChange(
                    "start_time"
                  )}
                  error={Boolean(
                    formErrors.start_time
                  )}
                  helperText={
                    formErrors.start_time
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Time"
                  type="datetime-local"
                  value={form.end_time}
                  onChange={handleChange(
                    "end_time"
                  )}
                  error={Boolean(
                    formErrors.end_time
                  )}
                  helperText={formErrors.end_time}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {selectedEvent && (
              <Alert
                severity="info"
                icon={<ScheduleRounded />}
                sx={{ borderRadius: 2 }}
              >
                Updating this event will immediately
                refresh the calendar schedule.
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            gap: 1,
          }}
        >
          {selectedEvent && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineRounded />}
              onClick={() => {
                setOpenDialog(false);
                setDeleteDialog(true);
              }}
              disabled={saving}
              sx={{
                mr: "auto",
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Delete
            </Button>
          )}

          <Button
            onClick={handleCloseDialog}
            disabled={saving}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveEvent}
            disabled={saving}
            startIcon={
              selectedEvent ? (
                <EditRounded />
              ) : (
                <AddRounded />
              )
            }
            sx={{
              minWidth: 140,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {saving
              ? "Saving..."
              : selectedEvent
              ? "Save Changes"
              : "Create Event"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog
        open={deleteDialog}
        onClose={() =>
          !deleting && setDeleteDialog(false)
        }
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: alpha(
                  theme.palette.error.main,
                  0.12
                ),
                color: "error.main",
              }}
            >
              <DeleteOutlineRounded />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Delete Event?
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                This action cannot be undone.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {selectedEvent && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(
                  theme.palette.error.main,
                  0.05
                ),
                border: `1px solid ${alpha(
                  theme.palette.error.main,
                  0.15
                )}`,
              }}
            >
              <Typography fontWeight={750}>
                {selectedEvent.class_name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Room {selectedEvent.room_number}
              </Typography>

              {selectedEvent.start_time && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 1,
                  }}
                >
                  {new Date(
                    selectedEvent.start_time
                  ).toLocaleString()}
                </Typography>
              )}
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteOutlineRounded />}
            onClick={handleDeleteEvent}
            disabled={deleting}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            {deleting ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) =>
          `1px solid ${theme.palette.divider}`,
        transition:
          "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: (theme) =>
            `0 12px 30px ${alpha(
              color,
              0.1
            )}`,
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              {label}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ mt: 0.5 }}
            >
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: alpha(color, 0.12),
              color,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SchoolCalendar;