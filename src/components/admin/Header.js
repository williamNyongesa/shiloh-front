import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  ArrowForwardRounded,
  ClearRounded,
  EmailRounded,
  KeyboardArrowDownRounded,
  NotificationsNoneRounded,
  ReceiptLongRounded,
  SearchRounded,
  SettingsRounded,
  DoneAllRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { getDemoUser } from "../../demoData";

const Header = () => {
  const navigate = useNavigate();

  /* =========================================================
     SEARCH STATE
  ========================================================= */

  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchInputRef = useRef(null);
  const searchTimerRef = useRef(null);

  /* =========================================================
     MENU STATE
  ========================================================= */

  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const [messageAnchor, setMessageAnchor] = useState(null);

  const [profileAnchor, setProfileAnchor] = useState(null);

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New payment received",
      message: "A student payment of Ksh 1,200 was completed.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Assignment submitted",
      message: "Brandon Carter submitted a new assignment.",
      time: "32 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      message: "The academic dashboard was updated successfully.",
      time: "2 hours ago",
      unread: false,
    },
  ]);

  const unreadNotifications = notifications.filter(
    (notification) => notification.unread,
  ).length;

  /* =========================================================
     MESSAGES
  ========================================================= */

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Maya Thompson",
      message: "Please review the latest student submissions.",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Academic Operations",
      message: "Your weekly academic report is ready.",
      time: "1 hour ago",
      unread: true,
    },
  ]);

  const unreadMessages = messages.filter((message) => message.unread).length;

  /* =========================================================
     USER
  ========================================================= */

  const user = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userDATA") || "null");

      if (stored) {
        return stored;
      }
    } catch (error) {
      console.error("Unable to read user data:", error);
    }

    return getDemoUser("admin");
  }, []);

  const username = user?.username || user?.name || "Jordan Ellis";

  const initials = username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =========================================================
     SEARCH API
  ========================================================= */

  const performSearch = useCallback(async (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      /*
       * Demo mode
       */
      const storedData = JSON.parse(localStorage.getItem("userDATA") || "null");

      if (storedData?.demo) {
        const demoTransactions = getDemoUser("admin")?.transactions || [];

        const results = demoTransactions
          .filter((transaction) => {
            const searchable = [
              transaction.id,
              transaction.description,
              transaction.transaction_type,
              transaction.status,
              transaction.amount,
              transaction.date,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return searchable.includes(normalizedQuery);
          })
          .slice(0, 8);

        setSearchResults(results);
        return;
      }

      /*
       * Production API
       */
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "https://shiloh-server-2t51.onrender.com/finances",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      const transactions = Array.isArray(data)
        ? data
        : data?.transactions || [];

      const results = transactions
        .filter((transaction) => {
          const searchable = [
            transaction.id,
            transaction.description,
            transaction.transaction_type,
            transaction.status,
            transaction.amount,
            transaction.date,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchable.includes(normalizedQuery);
        })
        .slice(0, 8);

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);

      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!inputValue.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return undefined;
    }

    setSearchOpen(true);

    searchTimerRef.current = setTimeout(() => {
      performSearch(inputValue);
    }, 350);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [inputValue, performSearch]);

  /* =========================================================
     SEARCH RESULT CLICK
  ========================================================= */

  const handleSearchResult = (transaction) => {
    setSearchOpen(false);

    setInputValue("");

    /*
     * Navigate to the transactions page.
     *
     * If your route is different, change this to
     * your transaction route.
     */
    navigate("/transactions", {
      state: {
        selectedTransaction: transaction,
      },
    });
  };

  /* =========================================================
     SEARCH KEYBOARD
  ========================================================= */

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setInputValue("");
      setSearchOpen(false);
      searchInputRef.current?.blur();
    }

    if (event.key === "Enter" && inputValue.trim()) {
      navigate("/transactions", {
        state: {
          search: inputValue.trim(),
        },
      });

      setSearchOpen(false);
    }
  };

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const clearSearch = () => {
    setInputValue("");
    setSearchResults([]);
    setSearchOpen(false);
    searchInputRef.current?.focus();
  };

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const openNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const closeNotifications = () => {
    setNotificationAnchor(null);
  };

  const markNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              unread: false,
            }
          : item,
      ),
    );

    closeNotifications();

    navigate("/notifications", {
      state: {
        notification,
      },
    });
  };

  /* =========================================================
     MESSAGES
  ========================================================= */

  const openMessages = (event) => {
    setMessageAnchor(event.currentTarget);
  };

  const closeMessages = () => {
    setMessageAnchor(null);
  };

  const markMessagesRead = () => {
    setMessages((previous) =>
      previous.map((message) => ({
        ...message,
        unread: false,
      })),
    );
  };

  const handleMessageClick = (message) => {
    setMessages((previous) =>
      previous.map((item) =>
        item.id === message.id
          ? {
              ...item,
              unread: false,
            }
          : item,
      ),
    );

    closeMessages();

    navigate("/messages", {
      state: {
        message,
      },
    });
  };

  /* =========================================================
     PROFILE
  ========================================================= */

  const openProfile = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const closeProfile = () => {
    setProfileAnchor(null);
  };

  const handleProfile = () => {
    closeProfile();
    navigate("/profile");
  };

  const handleSettings = () => {
    closeProfile();
    navigate("/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("refresh_token");

    localStorage.removeItem("userDATA");

    localStorage.removeItem("tokenExpiration");

    navigate("/login");
  };

  /* =========================================================
     FORMAT AMOUNT
  ========================================================= */

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,

        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha("#0F172A", 0.88)
            : alpha("#FFFFFF", 0.88),

        backdropFilter: "blur(20px) saturate(180%)",

        WebkitBackdropFilter: "blur(20px) saturate(180%)",

        borderBottom: "1px solid",

        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha("#FFFFFF", 0.08)
            : alpha("#0F172A", 0.08),

        color: "text.primary",
      }}
    >
      <Box
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          py: 1,

          width: "100%",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            minHeight: 58,
            justifyContent: "space-between",
          }}
        >
          {/* =================================================
              BRAND / PAGE TITLE
          ================================================== */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              minWidth: {
                xs: "auto",
                md: 210,
              },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,

                display: "grid",
                placeItems: "center",

                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",

                color: "#fff",

                boxShadow: "0 8px 25px rgba(37, 99, 235, 0.28)",

                position: "relative",

                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.25), transparent)",
                },
              }}
            >
              <AccountBalanceWalletRounded
                sx={{
                  fontSize: 22,
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Box>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <Typography
                fontWeight={850}
                fontSize="1rem"
                lineHeight={1.1}
                letterSpacing="-0.02em"
              >
                Dashboard
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Academic operations
              </Typography>
            </Box>
          </Stack>

          {/* =================================================
              SEARCH
          ================================================== */}

          <Box
            sx={{
              flex: 1,
              maxWidth: 620,
              mx: "auto",
              position: "relative",
            }}
          >
            <TextField
              inputRef={searchInputRef}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onFocus={() => {
                if (inputValue.trim()) {
                  setSearchOpen(true);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search transactions, payments..."
              size="small"
              fullWidth
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded
                      sx={{
                        fontSize: 21,
                        color: "text.secondary",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: isLoading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={18} thickness={5} />
                  </InputAdornment>
                ) : inputValue ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                      sx={{
                        mr: -0.5,
                      }}
                    >
                      <ClearRounded fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: 3,

                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha("#FFFFFF", 0.055)
                      : alpha("#0F172A", 0.035),

                  transition: "all 0.25s ease",

                  "& fieldset": {
                    borderColor: "transparent",
                  },

                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha("#FFFFFF", 0.08)
                        : alpha("#0F172A", 0.05),
                  },

                  "&.Mui-focused": {
                    backgroundColor: "background.paper",

                    boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",

                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                },

                "& input": {
                  fontSize: 14,
                },
              }}
            />

            {/* =================================================
                SEARCH RESULTS
            ================================================== */}

            <Popper
              open={searchOpen && Boolean(inputValue.trim())}
              anchorEl={searchInputRef.current}
              placement="bottom-start"
              transition
              style={{
                width: searchInputRef.current?.clientWidth || "auto",
                zIndex: 1500,
              }}
            >
              {({ TransitionProps }) => (
                <Zoom
                  {...TransitionProps}
                  style={{
                    transformOrigin: "top center",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 1,
                      overflow: "hidden",

                      borderRadius: 3,

                      border: "1px solid",
                      borderColor: "divider",

                      boxShadow: "0 20px 60px rgba(15,23,42,0.16)",

                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {isLoading ? (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                        }}
                      >
                        <CircularProgress size={24} />

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Searching transactions...
                        </Typography>
                      </Box>
                    ) : searchResults.length > 0 ? (
                      <>
                        <Box
                          sx={{
                            px: 2,
                            py: 1.25,
                            backgroundColor: "action.hover",
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={800}
                            color="text.secondary"
                            sx={{
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Search results
                          </Typography>
                        </Box>

                        <List disablePadding>
                          {searchResults.map((transaction) => (
                            <ListItemButton
                              key={transaction.id}
                              onClick={() => handleSearchResult(transaction)}
                              sx={{
                                px: 2,
                                py: 1.25,

                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.07),
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: 2,
                                  mr: 1.5,
                                  display: "grid",
                                  placeItems: "center",
                                  flexShrink: 0,
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.1),
                                  color: "primary.main",
                                }}
                              >
                                <ReceiptLongRounded fontSize="small" />
                              </Box>

                              <ListItemText
                                primary={
                                  <Typography fontWeight={700} fontSize={13}>
                                    {transaction.description ||
                                      transaction.transaction_type ||
                                      "Transaction"}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {transaction.id || "Reference"} • Ksh{" "}
                                    {formatAmount(transaction.amount)}
                                  </Typography>
                                }
                              />

                              <ArrowForwardRounded
                                sx={{
                                  fontSize: 18,
                                  color: "text.disabled",
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </List>

                        <Divider />

                        <MenuItem
                          onClick={() => {
                            navigate("/transactions", {
                              state: {
                                search: inputValue,
                              },
                            });

                            setSearchOpen(false);
                          }}
                          sx={{
                            py: 1.25,
                            fontWeight: 700,
                            color: "primary.main",
                          }}
                        >
                          View all results
                          <ArrowForwardRounded
                            sx={{
                              ml: "auto",
                              fontSize: 18,
                            }}
                          />
                        </MenuItem>
                      </>
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                        }}
                      >
                        <SearchRounded
                          sx={{
                            fontSize: 38,
                            color: "text.disabled",
                          }}
                        />

                        <Typography fontWeight={700} sx={{ mt: 1 }}>
                          No results found
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Try another transaction reference or description.
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Zoom>
              )}
            </Popper>
          </Box>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <Stack direction="row" alignItems="center" spacing={0.5}>
            {/* Notifications */}

            <Tooltip title="Notifications">
              <IconButton
                onClick={openNotifications}
                sx={{
                  width: 42,
                  height: 42,
                  color: "text.primary",
                  borderRadius: 2.5,

                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.09),
                    color: "primary.main",
                  },
                }}
              >
                <Badge
                  badgeContent={unreadNotifications}
                  color="error"
                  max={99}
                >
                  <NotificationsNoneRounded />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Messages */}

            <Tooltip title="Messages">
              <IconButton
                onClick={openMessages}
                sx={{
                  width: 42,
                  height: 42,
                  color: "text.primary",
                  borderRadius: 2.5,

                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.09),
                    color: "primary.main",
                  },
                }}
              >
                <Badge badgeContent={unreadMessages} color="warning" max={99}>
                  <EmailRounded />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}

            <Tooltip title="Account">
              <IconButton
                onClick={openProfile}
                sx={{
                  ml: 0.5,
                  p: 0.4,
                  borderRadius: 2.5,

                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 13,
                    fontWeight: 800,

                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",

                    boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                  }}
                >
                  {initials}
                </Avatar>

                <KeyboardArrowDownRounded
                  sx={{
                    display: {
                      xs: "none",
                      md: "block",
                    },
                    ml: 0.25,
                    color: "text.secondary",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* =======================================================
          NOTIFICATIONS MENU
      ======================================================== */}

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={closeNotifications}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 360,
            maxWidth: "calc(100vw - 24px)",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 20px 60px rgba(15,23,42,0.16)",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={800}>Notifications</Typography>

              <Typography variant="caption" color="text.secondary">
                {unreadNotifications} unread notifications
              </Typography>
            </Box>

            {unreadNotifications > 0 && (
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={markNotificationsRead}>
                  <DoneAllRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

        <Divider />

        <List
          disablePadding
          sx={{
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          {notifications.map((notification) => (
            <ListItemButton
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                px: 2,
                py: 1.5,
                alignItems: "flex-start",

                backgroundColor: notification.unread
                  ? (theme) => alpha(theme.palette.primary.main, 0.04)
                  : "transparent",

                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  mt: 1,
                  mr: 1.5,
                  flexShrink: 0,
                  backgroundColor: notification.unread
                    ? "primary.main"
                    : "transparent",
                }}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontWeight={notification.unread ? 750 : 600}
                  fontSize={13}
                >
                  {notification.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 0.25,
                  }}
                >
                  {notification.message}
                </Typography>

                <Typography variant="caption" color="text.disabled">
                  {notification.time}
                </Typography>
              </Box>
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <MenuItem
          onClick={() => {
            closeNotifications();
            navigate("/notifications");
          }}
          sx={{
            py: 1.25,
            justifyContent: "center",
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          View all notifications
        </MenuItem>
      </Menu>

      {/* =======================================================
          MESSAGES MENU
      ======================================================== */}

      <Menu
        anchorEl={messageAnchor}
        open={Boolean(messageAnchor)}
        onClose={closeMessages}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 360,
            maxWidth: "calc(100vw - 24px)",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 20px 60px rgba(15,23,42,0.16)",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={800}>Messages</Typography>

              <Typography variant="caption" color="text.secondary">
                {unreadMessages} unread
              </Typography>
            </Box>

            {unreadMessages > 0 && (
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={markMessagesRead}>
                  <DoneAllRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

        <Divider />

        <List
          disablePadding
          sx={{
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {messages.map((message) => (
            <ListItemButton
              key={message.id}
              onClick={() => handleMessageClick(message)}
              sx={{
                px: 2,
                py: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  mr: 1.5,
                  fontSize: 12,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #14B8A6, #2563EB)",
                }}
              >
                {message.sender
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </Avatar>

              <ListItemText
                primary={
                  <Typography
                    fontSize={13}
                    fontWeight={message.unread ? 750 : 600}
                  >
                    {message.sender}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                      }}
                    >
                      {message.message}
                    </Typography>

                    <Typography variant="caption" color="text.disabled">
                      {message.time}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <MenuItem
          onClick={() => {
            closeMessages();
            navigate("/messages");
          }}
          sx={{
            py: 1.25,
            justifyContent: "center",
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          Open messages
        </MenuItem>
      </Menu>

      {/* =======================================================
          PROFILE MENU
      ======================================================== */}

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeProfile}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 240,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 20px 60px rgba(15,23,42,0.16)",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontWeight: 800,
                fontSize: 13,
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              }}
            >
              {initials}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={800} noWrap>
                {username}
              </Typography>

              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email || "admin@shiloh.test"}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile} sx={{ py: 1.2 }}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              mr: 1.5,
              backgroundColor: "action.selected",
              color: "text.primary",
            }}
          >
            {initials}
          </Avatar>
          My profile
        </MenuItem>

        <MenuItem onClick={handleSettings} sx={{ py: 1.2 }}>
          <SettingsRounded
            sx={{
              mr: 1.5,
              fontSize: 20,
              color: "text.secondary",
            }}
          />
          Settings
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.2,
            color: "error.main",
            fontWeight: 700,
          }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
