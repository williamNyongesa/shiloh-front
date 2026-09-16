import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  DeleteOutline as DeleteIcon,
  DraftsOutlined as ReadIcon,
  EmailOutlined as EmailIcon,
  InboxOutlined as InboxIcon,
  MarkEmailUnreadOutlined as UnreadIcon,
  MoreVert as MoreIcon,
  ReplyOutlined as ReplyIcon,
  Search as SearchIcon,
  SendOutlined as SendIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./Overview";

const DEMO_MESSAGES_KEY =
  "shiloh_demo_messages";

const INITIAL_MESSAGE = {
  recipient: "",
  subject: "",
  body: "",
};

const DEMO_MESSAGES = [
  {
    id: "MSG-0001",
    sender: "Mary Wanjiku",
    senderEmail: "mary@example.com",
    recipient: "admin@shilohschool.ac.ke",
    recipientName: "Administrator",
    subject: "Student attendance report",
    body:
      "Good morning. I have uploaded the latest attendance report for review. Please let me know if any additional information is required.",
    date: "2026-09-14T08:30:00",
    read: false,
    type: "received",
  },
  {
    id: "MSG-0002",
    sender: "David Kiptoo",
    senderEmail: "david@example.com",
    recipient: "admin@shilohschool.ac.ke",
    recipientName: "Administrator",
    subject: "Mathematics department meeting",
    body:
      "The Mathematics department meeting has been scheduled for Friday at 10:00 AM in Room A2.",
    date: "2026-09-13T15:45:00",
    read: true,
    type: "received",
  },
  {
    id: "MSG-0003",
    sender: "Administrator",
    senderEmail: "admin@shilohschool.ac.ke",
    recipient: "teachers@shilohschool.ac.ke",
    recipientName: "Teaching Staff",
    subject: "Staff meeting reminder",
    body:
      "This is a reminder that the staff meeting will take place tomorrow at 8:00 AM.",
    date: "2026-09-13T12:20:00",
    read: true,
    type: "sent",
  },
  {
    id: "MSG-0004",
    sender: "Peter Mwangi",
    senderEmail: "peter@example.com",
    recipient: "admin@shilohschool.ac.ke",
    recipientName: "Administrator",
    subject: "Library books request",
    body:
      "Could we please order additional copies of the Form 3 Chemistry textbooks? Several students are currently sharing books.",
    date: "2026-09-12T09:15:00",
    read: false,
    type: "received",
  },
];

const RECIPIENTS = [
  {
    value: "teachers",
    label: "All Teachers",
    email: "teachers@shilohschool.ac.ke",
  },
  {
    value: "students",
    label: "All Students",
    email: "students@shilohschool.ac.ke",
  },
  {
    value: "parents",
    label: "Parents",
    email: "parents@shilohschool.ac.ke",
  },
  {
    value: "staff",
    label: "All Staff",
    email: "staff@shilohschool.ac.ke",
  },
];

const Messages = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [folder, setFolder] = useState("inbox");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [composeOpen, setComposeOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [messageForm, setMessageForm] =
    useState(INITIAL_MESSAGE);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userData = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("userDATA") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const isDemo = Boolean(userData?.demo);

  /*
   * -------------------------------------------------------
   * Helpers
   * -------------------------------------------------------
   */

  const showMessage = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getStoredMessages = () => {
    try {
      const stored = localStorage.getItem(
        DEMO_MESSAGES_KEY
      );

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "Unable to load demo messages:",
        error
      );
    }

    localStorage.setItem(
      DEMO_MESSAGES_KEY,
      JSON.stringify(DEMO_MESSAGES)
    );

    return DEMO_MESSAGES;
  };

  const saveMessages = (data) => {
    localStorage.setItem(
      DEMO_MESSAGES_KEY,
      JSON.stringify(data)
    );
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase() || "U";
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return "";
    }

    const today = new Date();

    const isToday =
      messageDate.toDateString() ===
      today.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    return messageDate.toLocaleDateString(
      [],
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  /*
   * -------------------------------------------------------
   * READ
   * -------------------------------------------------------
   */

  const fetchMessages = async () => {
    setLoading(true);

    try {
      if (isDemo) {
        setMessages(getStoredMessages());
        return;
      }

      const response =
        await axiosInstance.get(
          "/communication/messages"
        );

      const data = Array.isArray(
        response.data
      )
        ? response.data
        : response.data?.messages || [];

      setMessages(data);
    } catch (error) {
      console.error(
        "Unable to load messages:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to load messages.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    fetchMessages();
  }, [isDemo]);

  /*
   * -------------------------------------------------------
   * FILTER
   * -------------------------------------------------------
   */

  const folderMessages = useMemo(() => {
    let result = messages;

    if (folder === "inbox") {
      result = messages.filter(
        (message) =>
          message.type !== "sent"
      );
    }

    if (folder === "sent") {
      result = messages.filter(
        (message) =>
          message.type === "sent"
      );
    }

    if (folder === "unread") {
      result = messages.filter(
        (message) =>
          message.type !== "sent" &&
          !message.read
      );
    }

    const query =
      searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (message) =>
          String(
            message.sender || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            message.subject || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(message.body || "")
            .toLowerCase()
            .includes(query)
      );
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );
  }, [
    messages,
    folder,
    searchQuery,
  ]);

  const unreadCount = messages.filter(
    (message) =>
      message.type !== "sent" &&
      !message.read
  ).length;

  const inboxCount = messages.filter(
    (message) =>
      message.type !== "sent"
  ).length;

  const sentCount = messages.filter(
    (message) =>
      message.type === "sent"
  ).length;

  /*
   * -------------------------------------------------------
   * Select message
   * -------------------------------------------------------
   */

  const openMessage = (message) => {
    let updatedMessage = message;

    if (!message.read && message.type !== "sent") {
      updatedMessage = {
        ...message,
        read: true,
      };

      const nextMessages = messages.map(
        (item) =>
          String(item.id) ===
          String(message.id)
            ? updatedMessage
            : item
      );

      setMessages(nextMessages);

      if (isDemo) {
        saveMessages(nextMessages);
      } else {
        axiosInstance
          .put(
            `/communication/messages/${message.id}/read`
          )
          .catch((error) =>
            console.error(
              "Unable to mark message read:",
              error
            )
          );
      }
    }

    setSelectedMessage(updatedMessage);
  };

  /*
   * -------------------------------------------------------
   * DELETE
   * -------------------------------------------------------
   */

  const handleDelete = async (message) => {
    if (
      !window.confirm(
        "Delete this message?"
      )
    ) {
      return;
    }

    try {
      if (isDemo) {
        const nextMessages =
          messages.filter(
            (item) =>
              String(item.id) !==
              String(message.id)
          );

        setMessages(nextMessages);
        saveMessages(nextMessages);
      } else {
        await axiosInstance.delete(
          `/communication/messages/${message.id}`
        );

        await fetchMessages();
      }

      setSelectedMessage(null);

      showMessage(
        "Message deleted successfully."
      );
    } catch (error) {
      console.error(
        "Unable to delete message:",
        error
      );

      showMessage(
        "Unable to delete message.",
        "error"
      );
    }
  };

  /*
   * -------------------------------------------------------
   * Compose
   * -------------------------------------------------------
   */

  const openCompose = () => {
    setMessageForm(INITIAL_MESSAGE);
    setComposeOpen(true);
  };

  const closeCompose = () => {
    if (sending) return;

    setComposeOpen(false);
    setMessageForm(INITIAL_MESSAGE);
  };

  const handleComposeChange = (event) => {
    const { name, value } = event.target;

    setMessageForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSendMessage = async () => {
    if (!messageForm.recipient) {
      showMessage(
        "Please select a recipient.",
        "error"
      );
      return;
    }

    if (!messageForm.subject.trim()) {
      showMessage(
        "Please enter a subject.",
        "error"
      );
      return;
    }

    if (!messageForm.body.trim()) {
      showMessage(
        "Please enter a message.",
        "error"
      );
      return;
    }

    setSending(true);

    try {
      const recipient =
        RECIPIENTS.find(
          (item) =>
            item.value ===
            messageForm.recipient
        );

      if (isDemo) {
        const newMessage = {
          id: `MSG-${Date.now()}`,
          sender:
            userData?.username ||
            "Administrator",
          senderEmail:
            userData?.email ||
            "admin@shilohschool.ac.ke",
          recipient:
            recipient?.email ||
            messageForm.recipient,
          recipientName:
            recipient?.label ||
            messageForm.recipient,
          subject:
            messageForm.subject.trim(),
          body:
            messageForm.body.trim(),
          date: new Date().toISOString(),
          read: true,
          type: "sent",
        };

        const nextMessages = [
          newMessage,
          ...messages,
        ];

        setMessages(nextMessages);
        saveMessages(nextMessages);

        setComposeOpen(false);
        setMessageForm(INITIAL_MESSAGE);

        showMessage(
          "Message sent successfully."
        );

        return;
      }

      await axiosInstance.post(
        "/communication/messages",
        {
          recipient:
            recipient?.email ||
            messageForm.recipient,
          subject:
            messageForm.subject.trim(),
          body:
            messageForm.body.trim(),
        }
      );

      setComposeOpen(false);
      setMessageForm(INITIAL_MESSAGE);

      await fetchMessages();

      showMessage(
        "Message sent successfully."
      );
    } catch (error) {
      console.error(
        "Unable to send message:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to send message.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  const handleReply = () => {
    if (!selectedMessage) return;

    setMessageForm({
      recipient:
        selectedMessage.senderEmail ||
        selectedMessage.sender ||
        "",
      subject: selectedMessage.subject
        ?.startsWith("Re:")
        ? selectedMessage.subject
        : `Re: ${selectedMessage.subject}`,
      body: `\n\n\n--- Original message ---\n${selectedMessage.body}`,
    });

    setComposeOpen(true);
  };

  /*
   * -------------------------------------------------------
   * Sidebar
   * -------------------------------------------------------
   */

  const sidebar = (
    <Box
      sx={{
        width: {
          xs: "100%",
          md: 240,
        },
        flexShrink: 0,
        zIndex: 9900000,
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openCompose}
        fullWidth
        sx={{
          height: 48,
          borderRadius: 2.5,
          fontWeight: 700,
          mb: 2,
        }}
      >
        Compose message
      </Button>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <List disablePadding>
          <ListItemButton
            selected={folder === "inbox"}
            onClick={() =>
              setFolder("inbox")
            }
            sx={{
              py: 1.4,
              px: 2,
            }}
          >
            <InboxIcon
              sx={{
                mr: 1.5,
                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                flex: 1,
                fontWeight:
                  folder === "inbox"
                    ? 700
                    : 500,
              }}
            >
              Inbox
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {inboxCount}
            </Typography>
          </ListItemButton>

          <ListItemButton
            selected={folder === "unread"}
            onClick={() =>
              setFolder("unread")
            }
            sx={{
              py: 1.4,
              px: 2,
            }}
          >
            <Badge
              color="error"
              variant="dot"
              invisible={!unreadCount}
              sx={{ mr: 1.5 }}
            >
              <UnreadIcon />
            </Badge>

            <Typography
              sx={{
                flex: 1,
                fontWeight:
                  folder === "unread"
                    ? 700
                    : 500,
              }}
            >
              Unread
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {unreadCount}
            </Typography>
          </ListItemButton>

          <ListItemButton
            selected={folder === "sent"}
            onClick={() =>
              setFolder("sent")
            }
            sx={{
              py: 1.4,
              px: 2,
            }}
          >
            <SendIcon
              sx={{
                mr: 1.5,
                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                flex: 1,
                fontWeight:
                  folder === "sent"
                    ? 700
                    : 500,
              }}
            >
              Sent
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {sentCount}
            </Typography>
          </ListItemButton>
        </List>
      </Paper>
    </Box>
  );

  if (!userData) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.02), rgba(59,130,246,0.025))",
      }}
    >
      {/* Header */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        gap={2}
        mb={3}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                borderRadius: 2,
              }}
            >
              <EmailIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  letterSpacing:
                    "-0.03em",
                  fontSize: {
                    xs: "1.7rem",
                    md: "2.1rem",
                  },
                }}
              >
                Messages
              </Typography>

              <Typography
                color="text.secondary"
              >
                Manage school communications.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Chip
          label={`${unreadCount} unread`}
          color={
            unreadCount > 0
              ? "error"
              : "default"
          }
          variant={
            unreadCount > 0
              ? "filled"
              : "outlined"
          }
        />
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        {/* Sidebar */}

        {sidebar}

        {/* Messages */}

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* Search */}

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider />

          {loading ? (
            <Box sx={{ p: 2 }}>
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  sx={{ py: 1.8 }}
                >
                  <Skeleton
                    variant="circular"
                    width={44}
                    height={44}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="30%" />
                    <Skeleton width="70%" />
                    <Skeleton width="90%" />
                  </Box>
                </Stack>
              ))}
            </Box>
          ) : folderMessages.length === 0 ? (
            <Box
              sx={{
                py: 10,
                px: 3,
                textAlign: "center",
              }}
            >
              <EmailIcon
                sx={{
                  fontSize: 54,
                  color: "text.disabled",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                No messages
              </Typography>

              <Typography
                color="text.secondary"
                variant="body2"
              >
                There are no messages matching
                your current view.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {folderMessages.map(
                (message) => (
                  <ListItemButton
                    key={message.id}
                    onClick={() =>
                      openMessage(message)
                    }
                    sx={{
                      px: {
                        xs: 1.5,
                        md: 2,
                      },
                      py: 1.7,
                      borderBottom:
                        "1px solid",
                      borderColor:
                        "divider",
                      bgcolor:
                        !message.read &&
                        message.type !==
                          "sent"
                          ? "action.hover"
                          : "transparent",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        mr: 1.5,
                        bgcolor:
                          message.type ===
                          "sent"
                            ? "secondary.main"
                            : "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(
                        message.sender
                      )}
                    </Avatar>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                      >
                        <Typography
                          noWrap
                          fontWeight={
                            !message.read &&
                            message.type !==
                              "sent"
                              ? 800
                              : 600
                          }
                        >
                          {message.type ===
                          "sent"
                            ? `To: ${message.recipientName || message.recipient}`
                            : message.sender}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            message.date
                          )}
                        </Typography>
                      </Stack>

                      <Typography
                        noWrap
                        variant="body2"
                        fontWeight={
                          !message.read &&
                          message.type !==
                            "sent"
                            ? 700
                            : 500
                        }
                        sx={{ mt: 0.3 }}
                      >
                        {message.subject}
                      </Typography>

                      <Typography
                        noWrap
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.2,
                        }}
                      >
                        {message.body}
                      </Typography>
                    </Box>

                    {!message.read &&
                      message.type !==
                        "sent" && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius:
                              "50%",
                            bgcolor:
                              "primary.main",
                            ml: 1,
                          }}
                        />
                      )}
                  </ListItemButton>
                )
              )}
            </List>
          )}
        </Paper>

        {/* Message detail */}

        {selectedMessage && (
          <Paper
            elevation={0}
            sx={{
              width: {
                xs: "100%",
                md: 390,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <IconButton
                  onClick={() =>
                    setSelectedMessage(null)
                  }
                >
                  <ArrowBackIcon />
                </IconButton>

                <Stack
                  direction="row"
                  spacing={0.5}
                >
                  <Tooltip title="Reply">
                    <IconButton
                      color="primary"
                      onClick={handleReply}
                    >
                      <ReplyIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(
                          selectedMessage
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  lineHeight: 1.3,
                  mb: 2,
                }}
              >
                {selectedMessage.subject}
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                mb={3}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      "primary.main",
                    fontWeight: 700,
                  }}
                >
                  {getInitials(
                    selectedMessage.sender
                  )}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    fontWeight={700}
                  >
                    {selectedMessage.sender}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {selectedMessage.senderEmail}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={2}
              >
                {new Date(
                  selectedMessage.date
                ).toLocaleString()}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                }}
              >
                {selectedMessage.body}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      {/* =====================================================
          COMPOSE
      ====================================================== */}

      <Drawer
        anchor="right"
        open={composeOpen}
        onClose={closeCompose}
        PaperProps={{
          sx: {
            width: {
              xs: "100%",
              sm: 500,
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2.5 }}>
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
                  New message
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Send a message to school
                  members.
                </Typography>
              </Box>

              <IconButton
                onClick={closeCompose}
                disabled={sending}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Divider />

          <Box
            sx={{
              p: 2.5,
              flex: 1,
              overflowY: "auto",
            }}
          >
            <Stack spacing={2.3}>
              <TextField
                select
                label="Recipient"
                name="recipient"
                value={
                  messageForm.recipient
                }
                onChange={
                  handleComposeChange
                }
                fullWidth
              >
                {RECIPIENTS.map(
                  (recipient) => (
                    <MenuItem
                      key={recipient.value}
                      value={
                        recipient.value
                      }
                    >
                      <Box>
                        <Typography>
                          {recipient.label}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {recipient.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                  )
                )}
              </TextField>

              <TextField
                label="Subject"
                name="subject"
                value={
                  messageForm.subject
                }
                onChange={
                  handleComposeChange
                }
                fullWidth
                placeholder="Message subject"
              />

              <TextField
                label="Message"
                name="body"
                value={messageForm.body}
                onChange={
                  handleComposeChange
                }
                fullWidth
                multiline
                minRows={12}
                placeholder="Write your message..."
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
            >
              <Button
                onClick={closeCompose}
                disabled={sending}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={
                  sending ? (
                    <CircularProgress
                      size={17}
                    />
                  ) : (
                    <SendIcon />
                  )
                }
                onClick={
                  handleSendMessage
                }
                disabled={sending}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                }}
              >
                {sending
                  ? "Sending..."
                  : "Send message"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
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

export default Messages;