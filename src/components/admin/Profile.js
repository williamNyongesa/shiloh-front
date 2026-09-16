import React, { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  AdminPanelSettings as AdminIcon,
  CameraAltOutlined as CameraIcon,
  CheckCircleOutline as CheckIcon,
  EditOutlined as EditIcon,
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  PersonOutline as PersonIcon,
  SaveOutlined as SaveIcon,
  SchoolOutlined as SchoolIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./Overview";

const PROFILE_STORAGE_KEY = "shiloh_demo_profile";

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

  const getInitialProfile = () => {
    try {
      const stored = localStorage.getItem(
        PROFILE_STORAGE_KEY
      );

      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore malformed demo profile.
    }

    return {
      username:
        userData?.username ||
        userData?.name ||
        "Administrator",
      email:
        userData?.email ||
        "admin@shilohschool.ac.ke",
      role: userData?.role || "admin",
      phone: userData?.phone || "",
      bio:
        userData?.bio ||
        "School administrator responsible for managing the Shiloh school system.",
    };
  };

  const [profile, setProfile] = useState(
    getInitialProfile
  );

  const [formData, setFormData] = useState({
    username: profile.username || "",
    email: profile.email || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase() || "AD";
  };

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.username.trim()) {
      showMessage(
        "Username is required.",
        "error"
      );
      return;
    }

    if (!formData.email.trim()) {
      showMessage(
        "Email is required.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      if (isDemo) {
        const updatedProfile = {
          ...profile,
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
        };

        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(updatedProfile)
        );

        const updatedUserData = {
          ...userData,
          username: updatedProfile.username,
          email: updatedProfile.email,
        };

        localStorage.setItem(
          "userDATA",
          JSON.stringify(updatedUserData)
        );

        setProfile(updatedProfile);
        setEditing(false);

        showMessage(
          "Profile updated successfully."
        );

        return;
      }

      await axiosInstance.put(
        `/users/${userData.id}`,
        {
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
        }
      );

      setProfile((previous) => ({
        ...previous,
        ...formData,
      }));

      setEditing(false);

      showMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update failed:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to update profile.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      showMessage(
        "Enter your current password.",
        "error"
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage(
        "New password must contain at least 6 characters.",
        "error"
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      showMessage(
        "Passwords do not match.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      if (isDemo) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setChangingPassword(false);

        showMessage(
          "Password changed successfully."
        );

        return;
      }

      await axiosInstance.put(
        `/users/${userData.id}/password`,
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword,
        }
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setChangingPassword(false);

      showMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Password update failed:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to change password.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
    });

    setEditing(false);
  };

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

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            letterSpacing: "-0.03em",
            fontSize: {
              xs: "1.7rem",
              md: "2.1rem",
            },
          }}
        >
          My Profile
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Manage your account information and
          security settings.
        </Typography>
      </Box>

      {/* Profile hero */}

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            height: {
              xs: 120,
              md: 160,
            },
            background:
              "linear-gradient(135deg, #1976d2 0%, #14b8a6 100%)",
          }}
        />

        <Box
          sx={{
            px: {
              xs: 2,
              md: 4,
            },
            pb: 3,
            mt: -6,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "center",
              sm: "flex-end",
            }}
            justifyContent="space-between"
            gap={2}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              alignItems="center"
              gap={2}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: 112,
                    height: 112,
                    border: "5px solid white",
                    bgcolor: "primary.main",
                    fontSize: 34,
                    fontWeight: 800,
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.16)",
                  }}
                >
                  {getInitials(
                    profile.username
                  )}
                </Avatar>

                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 3,
                    bottom: 3,
                    bgcolor: "white",
                    boxShadow: 2,
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  <CameraIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  {profile.username}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.3 }}
                >
                  {profile.email}
                </Typography>

                <Chip
                  icon={<AdminIcon />}
                  label="Administrator"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Stack>

            {!editing && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() =>
                  setEditing(true)
                }
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                Edit profile
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Account information */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Account information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Your personal account details.
              </Typography>
            </Box>

            <PersonIcon color="primary" />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2.3}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!editing}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editing}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editing}
              fullWidth
            />

            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!editing}
              fullWidth
              multiline
              minRows={4}
            />
          </Stack>

          {editing && (
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
              mt={3}
            >
              <Button
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress size={17} />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={handleSaveProfile}
                disabled={saving}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                }}
              >
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </Stack>
          )}
        </Paper>

        {/* Account status */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
          >
            Account status
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Current account information.
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <CheckIcon color="success" />

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  Account status
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Active
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <AdminIcon color="primary" />

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  Account role
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Administrator
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <SchoolIcon color="primary" />

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  Access level
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Full system access
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Box>

      {/* Security */}

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          p: {
            xs: 2,
            md: 3,
          },
        }}
      >
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
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <LockIcon color="primary" />

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Security
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Keep your account secure by
              regularly updating your password.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() =>
              setChangingPassword(
                (previous) => !previous
              )
            }
            sx={{
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}
          >
            Change password
          </Button>
        </Stack>

        {changingPassword && (
          <>
            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                maxWidth: 600,
              }}
            >
              <Stack spacing={2}>
                <TextField
                  label="Current password"
                  name="currentPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    passwordData.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              (previous) =>
                                !previous
                            )
                          }
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="New password"
                  name="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    passwordData.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  fullWidth
                  helperText="Minimum 6 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowNewPassword(
                              (previous) =>
                                !previous
                            )
                          }
                          edge="end"
                        >
                          {showNewPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm new password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) =>
                                !previous
                            )
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={1}
                >
                  <Button
                    onClick={() =>
                      setChangingPassword(
                        false
                      )
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={
                      handleChangePassword
                    }
                    disabled={saving}
                    startIcon={
                      saving ? (
                        <CircularProgress
                          size={17}
                        />
                      ) : (
                        <LockIcon />
                      )
                    }
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    Update password
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </>
        )}
      </Paper>

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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;