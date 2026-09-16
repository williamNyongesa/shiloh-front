import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CheckCircleOutline,
  EmailOutlined,
  NotificationsActiveOutlined,
  PhoneAndroidOutlined,
  SendRounded,
  SmsOutlined,
} from "@mui/icons-material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { getDemoUser } from "../../demoData";

const API_URL =
  "https://shiloh-server-2t51.onrender.com/communication/notifications";

const Notification = () => {
  const theme = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedData = JSON.parse(
          localStorage.getItem("userDATA") || "null"
        );

        if (storedData?.demo) {
          const demoNotifications =
            getDemoUser("teacher")?.teacher?.notifications || [];

          setNotifications(demoNotifications);
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

        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        showSnackbar("Unable to load notifications.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const validationSchema = Yup.object({
    type: Yup.string().required("Notification type is required"),
    recipient: Yup.string()
      .trim()
      .required("Recipient is required"),
    message: Yup.string()
      .trim()
      .min(3, "Message must contain at least 3 characters")
      .required("Message is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const storedData = JSON.parse(
        localStorage.getItem("userDATA") || "null"
      );

      /*
       * Demo mode
       * -----------------------------
       * Do not attempt to POST demo data
       * to the production API.
       */
      if (storedData?.demo) {
        const newNotification = {
          id: `DEMO-${Date.now()}`,
          type: values.type,
          recipient: values.recipient,
          message: values.message,
          subject:
            values.type === "email"
              ? "Shiloh Learning Notification"
              : "Shiloh Notification",
          timestamp: new Date().toISOString(),
          status: "Sent",
        };

        setNotifications((previous) => [
          newNotification,
          ...previous,
        ]);

        resetForm();

        showSnackbar(
          `Notification sent successfully via ${values.type.toUpperCase()}.`
        );

        return;
      }

      const token = localStorage.getItem("access_token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.notification) {
        setNotifications((previous) => [
          result.notification,
          ...previous,
        ]);
      }

      resetForm();

      showSnackbar(
        result.message || "Notification sent successfully."
      );
    } catch (error) {
      console.error("Error sending notification:", error);

      showSnackbar(
        "The notification could not be sent. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statistics = useMemo(() => {
    const email = notifications.filter(
      (item) => item.type?.toLowerCase() === "email"
    ).length;

    const sms = notifications.filter(
      (item) => item.type?.toLowerCase() === "sms"
    ).length;

    return {
      total: notifications.length,
      email,
      sms,
    };
  }, [notifications]);

  const getNotificationIcon = (type) => {
    if (type?.toLowerCase() === "email") {
      return <EmailOutlined />;
    }

    return <SmsOutlined />;
  };

  const getNotificationColor = (type) => {
    if (type?.toLowerCase() === "email") {
      return theme.palette.primary.main;
    }

    return theme.palette.success.main;
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: { xs: 2, md: 4 },
        background: `linear-gradient(
          135deg,
          ${alpha(theme.palette.primary.main, 0.035)} 0%,
          transparent 45%,
          ${alpha(theme.palette.secondary.main, 0.035)} 100%
        )`,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                mb={1}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: `linear-gradient(
                      135deg,
                      ${theme.palette.primary.main},
                      ${theme.palette.secondary.main}
                    )`,
                    boxShadow: `0 8px 25px ${alpha(
                      theme.palette.primary.main,
                      0.25
                    )}`,
                  }}
                >
                  <NotificationsActiveOutlined />
                </Avatar>

                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      letterSpacing: "-0.03em",
                      fontSize: {
                        xs: "1.75rem",
                        md: "2.2rem",
                      },
                    }}
                  >
                    Notifications
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Send and manage communications across Shiloh.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Chip
              icon={<CheckCircleOutline />}
              label="Communication Center"
              color="success"
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
          </Stack>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Total Sent"
              value={statistics.total}
              icon={<NotificationsActiveOutlined />}
              color={theme.palette.primary.main}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <StatCard
              title="Email"
              value={statistics.email}
              icon={<EmailOutlined />}
              color={theme.palette.info.main}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <StatCard
              title="SMS"
              value={statistics.sms}
              icon={<SmsOutlined />}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Send notification */}
          <Grid item xs={12} lg={5}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `0.5px solid ${theme.palette.divider}`,
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(14px)",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  mb={3}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: alpha(
                        theme.palette.primary.main,
                        0.12
                      ),
                      color: "primary.main",
                    }}
                  >
                    <SendRounded />
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight={750}>
                      Send Notification
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Reach students, teachers or staff.
                    </Typography>
                  </Box>
                </Stack>

                <Formik
                  initialValues={{
                    type: "",
                    recipient: "",
                    message: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    isSubmitting,
                    errors,
                    touched,
                  }) => (
                    <Form>
                      <Stack spacing={2.2}>
                        <Field
                          as={TextField}
                          select
                          fullWidth
                          label="Notification Type"
                          name="type"
                          error={
                            touched.type && Boolean(errors.type)
                          }
                          helperText={
                            touched.type && errors.type
                              ? errors.type
                              : "Choose how the notification should be delivered."
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <NotificationsActiveOutlined fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          <MenuItem value="email">
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <EmailOutlined fontSize="small" />
                              <span>Email</span>
                            </Stack>
                          </MenuItem>

                          <MenuItem value="sms">
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <SmsOutlined fontSize="small" />
                              <span>SMS</span>
                            </Stack>
                          </MenuItem>
                        </Field>

                        <Field
                          as={TextField}
                          fullWidth
                          label="Recipient"
                          name="recipient"
                          placeholder="Email address or phone number"
                          error={
                            touched.recipient &&
                            Boolean(errors.recipient)
                          }
                          helperText={
                            touched.recipient && errors.recipient
                              ? errors.recipient
                              : "Enter the recipient contact."
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneAndroidOutlined fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Field
                          as={TextField}
                          fullWidth
                          multiline
                          minRows={5}
                          label="Message"
                          name="message"
                          placeholder="Write your notification..."
                          error={
                            touched.message &&
                            Boolean(errors.message)
                          }
                          helperText={
                            touched.message && errors.message
                              ? errors.message
                              : "Keep your message clear and concise."
                          }
                        />

                        <Button
                          type="submit"
                          fullWidth
                          size="large"
                          variant="contained"
                          disabled={isSubmitting}
                          startIcon={<SendRounded />}
                          sx={{
                            minHeight: 52,
                            borderRadius: 2.5,
                            fontWeight: 750,
                            textTransform: "none",
                            fontSize: "0.95rem",
                            background: `linear-gradient(
                              135deg,
                              ${theme.palette.primary.main},
                              ${theme.palette.secondary.main}
                            )`,
                            boxShadow: `0 10px 25px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                            "&:hover": {
                              boxShadow: `0 14px 30px ${alpha(
                                theme.palette.primary.main,
                                0.35
                              )}`,
                            },
                          }}
                        >
                          {isSubmitting
                            ? "Sending..."
                            : "Send Notification"}
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification history */}
          <Grid item xs={12} lg={7}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(14px)",
              }}
            >
              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={750}>
                    Notification History
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Recently sent communications.
                  </Typography>
                </Box>

                <Chip
                  label={`${notifications.length} records`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Divider />

              <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                {loading ? (
                  <Stack spacing={1.5}>
                    {[1, 2, 3, 4].map((item) => (
                      <Paper
                        key={item}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Skeleton
                            variant="circular"
                            width={42}
                            height={42}
                          />

                          <Box sx={{ flex: 1 }}>
                            <Skeleton width="35%" height={25} />
                            <Skeleton width="75%" />
                            <Skeleton width="50%" />
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : notifications.length > 0 ? (
                  <Stack spacing={1.5}>
                    {notifications.map((notification, index) => {
                      const iconColor = getNotificationColor(
                        notification.type
                      );

                      return (
                        <Paper
                          key={
                            notification.id ||
                            `${notification.timestamp}-${index}`
                          }
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: `1px solid ${theme.palette.divider}`,
                            transition:
                              "all 180ms ease",
                            "&:hover": {
                              transform:
                                "translateY(-2px)",
                              borderColor: alpha(
                                iconColor,
                                0.4
                              ),
                              boxShadow: `0 8px 25px ${alpha(
                                iconColor,
                                0.08
                              )}`,
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Avatar
                              sx={{
                                width: 42,
                                height: 42,
                                bgcolor: alpha(
                                  iconColor,
                                  0.12
                                ),
                                color: iconColor,
                              }}
                            >
                              {getNotificationIcon(
                                notification.type
                              )}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                                spacing={1}
                              >
                                <Typography
                                  fontWeight={700}
                                >
                                  {notification.subject ||
                                    "Notification"}
                                </Typography>

                                <Chip
                                  size="small"
                                  label={
                                    notification.type ||
                                    "Message"
                                  }
                                  sx={{
                                    textTransform:
                                      "uppercase",
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    bgcolor: alpha(
                                      iconColor,
                                      0.1
                                    ),
                                    color: iconColor,
                                  }}
                                />
                              </Stack>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.7,
                                  lineHeight: 1.6,
                                }}
                              >
                                {notification.message}
                              </Typography>

                              {notification.recipient && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "block",
                                    mt: 1,
                                  }}
                                >
                                  To:{" "}
                                  <strong>
                                    {
                                      notification.recipient
                                    }
                                  </strong>
                                </Typography>
                              )}

                              {notification.timestamp && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "block",
                                    mt: 0.5,
                                  }}
                                >
                                  {new Date(
                                    notification.timestamp
                                  ).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      py: 8,
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 2,
                        bgcolor: alpha(
                          theme.palette.primary.main,
                          0.1
                        ),
                        color: "primary.main",
                      }}
                    >
                      <NotificationsActiveOutlined />
                    </Avatar>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      No notifications yet
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Notifications you send will appear
                      here.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) =>
          `1px solid ${theme.palette.divider}`,
        background: (theme) =>
          alpha(theme.palette.background.paper, 0.8),
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: (theme) =>
            `0 12px 30px ${alpha(color, 0.1)}`,
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
              {title}
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

export default Notification;