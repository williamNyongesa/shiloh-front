import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  EmailOutlined as EmailIcon,
  GroupOutlined as GroupIcon,
  LockOutlined as LockIcon,
  PersonAddAlt1Outlined as PersonAddIcon,
  PersonOutline as PersonIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  SchoolOutlined as SchoolIcon,
  SupervisorAccountOutlined as TeacherIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./Overview";
import { getDemoUser } from "../../demoData";

const DEMO_STORAGE_KEY = "shiloh_demo_users";

const INITIAL_FORM = {
  username: "",
  email: "",
  role: "",
  password: "",
};

const ROLES = [
  {
    value: "admin",
    label: "Administrator",
    icon: <AdminIcon fontSize="small" />,
  },
  {
    value: "teacher",
    label: "Teacher",
    icon: <TeacherIcon fontSize="small" />,
  },
  {
    value: "student",
    label: "Student",
    icon: <SchoolIcon fontSize="small" />,
  },
];

const Users = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userDATA") || "null");
    } catch {
      return null;
    }
  }, []);

  const isDemo = Boolean(userData?.demo);

  /*
   * ------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------
   */

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const getInitials = (username = "") => {
    const parts = username.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return username.slice(0, 2).toUpperCase() || "U";
  };

  const getRoleLabel = (role) => {
    const found = ROLES.find((item) => item.value === role);
    return found?.label || role || "Unknown";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "secondary";
      case "teacher":
        return "info";
      case "student":
        return "success";
      default:
        return "default";
    }
  };

  const normalizeUser = (user, index = 0) => ({
    id:
      user?.id ??
      user?._id ??
      `DEMO-${String(index + 1).padStart(4, "0")}`,
    username: user?.username || user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
    password: "",
  });

  /*
   * ------------------------------------------------------------
   * Demo data
   * ------------------------------------------------------------
   */

  const getStoredDemoUsers = () => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Unable to read demo users:", error);
    }

    const demoData = getDemoUser("admin");

    const students = Array.isArray(demoData?.students)
      ? demoData.students.map((user, index) =>
          normalizeUser(
            {
              ...user,
              role: user.role || "student",
            },
            index
          )
        )
      : [];

    const teachers = Array.isArray(demoData?.teachers)
      ? demoData.teachers.map((user, index) =>
          normalizeUser(
            {
              ...user,
              role: user.role || "teacher",
            },
            students.length + index
          )
        )
      : [];

    const initialUsers = [...students, ...teachers];

    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify(initialUsers)
    );

    return initialUsers;
  };

  const saveDemoUsers = (nextUsers) => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  /*
   * ------------------------------------------------------------
   * Fetch users
   * ------------------------------------------------------------
   */

  const fetchUsers = async () => {
    setLoading(true);

    try {
      if (isDemo) {
        const demoUsers = getStoredDemoUsers();
        setUsers(demoUsers);
        return;
      }

      const response = await axiosInstance.get("/users");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.users || [];

      setUsers(data.map((user, index) => normalizeUser(user, index)));
    } catch (error) {
      console.error("Error fetching users:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to load users. Please try again.",
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

    if (userData.role !== "admin") {
      navigate("/home");
      return;
    }

    fetchUsers();
  }, [userData, navigate, isDemo]);

  /*
   * ------------------------------------------------------------
   * Form handling
   * ------------------------------------------------------------
   */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSelectedUser(null);
    setShowPassword(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (saving) return;

    setIsCreateModalOpen(false);
    resetForm();
  };

  const openEditModal = (user) => {
    setSelectedUser(user);

    setFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "",
      password: "",
    });

    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (saving) return;

    setIsEditModalOpen(false);
    resetForm();
  };

  const validateForm = (isEdit = false) => {
    if (!formData.username.trim()) {
      showMessage("Username is required.", "error");
      return false;
    }

    if (!formData.email.trim()) {
      showMessage("Email address is required.", "error");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showMessage("Please enter a valid email address.", "error");
      return false;
    }

    if (!formData.role) {
      showMessage("Please select a user role.", "error");
      return false;
    }

    if (!isEdit && !formData.password.trim()) {
      showMessage("Password is required when creating a user.", "error");
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      showMessage(
        "Password must contain at least 6 characters.",
        "error"
      );
      return false;
    }

    return true;
  };

  /*
   * ------------------------------------------------------------
   * CREATE
   * ------------------------------------------------------------
   */

  const handleCreateUser = async () => {
    if (!validateForm(false)) return;

    setSaving(true);

    try {
      if (isDemo) {
        const existingUsers = getStoredDemoUsers();

        const duplicate = existingUsers.some(
          (user) =>
            user.username.toLowerCase() ===
              formData.username.trim().toLowerCase() ||
            user.email.toLowerCase() ===
              formData.email.trim().toLowerCase()
        );

        if (duplicate) {
          showMessage(
            "A user with this username or email already exists.",
            "error"
          );
          return;
        }

        const newUser = {
          id: `DEMO-${Date.now()}`,
          username: formData.username.trim(),
          email: formData.email.trim(),
          role: formData.role,
          password: "",
        };

        const nextUsers = [...existingUsers, newUser];

        saveDemoUsers(nextUsers);
        setUsers(nextUsers);

        setIsCreateModalOpen(false);
        resetForm();

        showMessage("User created successfully.");
        return;
      }

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
      };

      await axiosInstance.post("/users", payload);

      setIsCreateModalOpen(false);
      resetForm();

      await fetchUsers();

      showMessage("User created successfully.");
    } catch (error) {
      console.error("Error creating user:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to create user. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * UPDATE
   * ------------------------------------------------------------
   */

  const handleEditUser = async () => {
    if (!selectedUser || !validateForm(true)) return;

    setSaving(true);

    try {
      if (isDemo) {
        const existingUsers = getStoredDemoUsers();

        const duplicate = existingUsers.some(
          (user) =>
            String(user.id) !== String(selectedUser.id) &&
            (user.username.toLowerCase() ===
              formData.username.trim().toLowerCase() ||
              user.email.toLowerCase() ===
                formData.email.trim().toLowerCase())
        );

        if (duplicate) {
          showMessage(
            "Another user already uses this username or email.",
            "error"
          );
          return;
        }

        const nextUsers = existingUsers.map((user) => {
          if (String(user.id) !== String(selectedUser.id)) {
            return user;
          }

          return {
            ...user,
            username: formData.username.trim(),
            email: formData.email.trim(),
            role: formData.role,
          };
        });

        saveDemoUsers(nextUsers);
        setUsers(nextUsers);

        setIsEditModalOpen(false);
        resetForm();

        showMessage("User updated successfully.");
        return;
      }

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      await axiosInstance.put(
        `/users/${selectedUser.id}`,
        payload
      );

      setIsEditModalOpen(false);
      resetForm();

      await fetchUsers();

      showMessage("User updated successfully.");
    } catch (error) {
      console.error("Error editing user:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to update user. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * DELETE
   * ------------------------------------------------------------
   */

  const openDeleteDialog = (user) => {
    if (
      userData?.id &&
      String(userData.id) === String(user.id)
    ) {
      showMessage("You cannot delete your own admin account.", "error");
      return;
    }

    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleting(true);

    try {
      if (isDemo) {
        const existingUsers = getStoredDemoUsers();

        const nextUsers = existingUsers.filter(
          (user) =>
            String(user.id) !== String(selectedUser.id)
        );

        saveDemoUsers(nextUsers);
        setUsers(nextUsers);

        setIsDeleteModalOpen(false);
        setSelectedUser(null);

        showMessage("User deleted successfully.");
        return;
      }

      await axiosInstance.delete(
        `/users/${selectedUser.id}`
      );

      setIsDeleteModalOpen(false);
      setSelectedUser(null);

      await fetchUsers();

      showMessage("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to delete user. Please try again.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * Filtering
   * ------------------------------------------------------------
   */

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        String(user.username || "")
          .toLowerCase()
          .includes(query) ||
        String(user.email || "")
          .toLowerCase()
          .includes(query) ||
        String(user.id || "")
          .toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "all" ||
        String(user.role).toLowerCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  /*
   * ------------------------------------------------------------
   * Statistics
   * ------------------------------------------------------------
   */

  const statistics = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      teachers: users.filter((user) => user.role === "teacher").length,
      students: users.filter((user) => user.role === "student").length,
    };
  }, [users]);

  /*
   * ------------------------------------------------------------
   * Loading state
   * ------------------------------------------------------------
   */

  if (!userData) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /*
   * ------------------------------------------------------------
   * Shared form
   * ------------------------------------------------------------
   */

  const renderUserForm = () => (
    <Stack spacing={2.2} sx={{ mt: 1 }}>
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        fullWidth
        autoFocus
        placeholder="e.g. john.doe"
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
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        fullWidth
        placeholder="user@example.com"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>

        <Select
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleInputChange}
        >
          {ROLES.map((role) => (
            <MenuItem
              key={role.value}
              value={role.value}
            >
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
              >
                {role.icon}
                <span>{role.label}</span>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label={
          isEditModalOpen
            ? "New password (optional)"
            : "Password"
        }
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleInputChange}
        fullWidth
        helperText={
          isEditModalOpen
            ? "Leave blank to keep the current password."
            : "Use at least 6 characters."
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setShowPassword((previous) => !previous)
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
    </Stack>
  );

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
          "linear-gradient(180deg, rgba(15,23,42,0.02) 0%, rgba(59,130,246,0.02) 100%)",
      }}
    >
      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          mb: 3,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box>
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
            Users
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage administrators, teachers and students.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          width={{
            xs: "100%",
            sm: "auto",
          }}
        >
          <Tooltip title="Refresh users">
            <IconButton
              onClick={fetchUsers}
              disabled={loading}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
            sx={{
              minHeight: 44,
              px: 2.5,
              borderRadius: 2.5,
              fontWeight: 700,
              flex: {
                xs: 1,
                sm: "unset",
              },
              boxShadow:
                "0 8px 24px rgba(25,118,210,0.22)",
            }}
          >
            Add User
          </Button>
        </Stack>
      </Box>

      {/* -------------------------------------------------- */}
      {/* Statistics */}
      {/* -------------------------------------------------- */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Total Users",
            value: statistics.total,
            icon: <GroupIcon />,
          },
          {
            label: "Administrators",
            value: statistics.admins,
            icon: <AdminIcon />,
          },
          {
            label: "Teachers",
            value: statistics.teachers,
            icon: <TeacherIcon />,
          },
          {
            label: "Students",
            value: statistics.students,
            icon: <SchoolIcon />,
          },
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.label}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  {loading ? (
                    <Skeleton width={50} />
                  ) : (
                    item.value
                  )}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "action.hover",
                  color: "primary.main",
                }}
              >
                {item.icon}
              </Avatar>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* -------------------------------------------------- */}
      {/* Main users panel */}
      {/* -------------------------------------------------- */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}

        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1.5,
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by username, email or ID..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                md: 420,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                md: 180,
              },
            }}
          >
            <InputLabel>Role</InputLabel>

            <Select
              value={roleFilter}
              label="Role"
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <MenuItem value="all">
                All roles
              </MenuItem>

              {ROLES.map((role) => (
                <MenuItem
                  key={role.value}
                  value={role.value}
                >
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Result summary */}

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing{" "}
            <strong>
              {filteredUsers.length}
            </strong>{" "}
            of <strong>{users.length}</strong> users
          </Typography>

          {isDemo && (
            <Chip
              size="small"
              label="Demo mode"
              color="info"
              variant="outlined"
            />
          )}
        </Box>

        <Divider />

        {/* ------------------------------------------------ */}
        {/* Desktop table */}
        {/* ------------------------------------------------ */}

        {!isMobile ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "action.hover",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    User
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Email
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Role
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    ID
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map(
                    (_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton width={180} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={220} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton width={100} />
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 8 }}
                    >
                      <PersonAddIcon
                        sx={{
                          fontSize: 46,
                          color: "text.disabled",
                          mb: 1,
                        }}
                      />

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        No users found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Try changing your search or
                        create a new user.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "primary.main",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {getInitials(
                              user.username
                            )}
                          </Avatar>

                          <Box>
                            <Typography
                              fontWeight={700}
                            >
                              {user.username}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              User account
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {user.email || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(
                            user.role
                          )}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              "monospace",
                          }}
                        >
                          {user.id}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          spacing={0.5}
                        >
                          <Tooltip title="Edit user">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                openEditModal(user)
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete user">
                            <IconButton
                              color="error"
                              onClick={() =>
                                openDeleteDialog(user)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* ------------------------------------------------ */
          /* Mobile cards */
          /* ------------------------------------------------ */

          <Box sx={{ p: 1.5 }}>
            {loading ? (
              Array.from({ length: 5 }).map(
                (_, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                    >
                      <Skeleton
                        variant="circular"
                        width={42}
                        height={42}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Skeleton width="50%" />
                        <Skeleton width="80%" />
                        <Skeleton width="30%" />
                      </Box>
                    </Stack>
                  </Paper>
                )
              )
            ) : filteredUsers.length === 0 ? (
              <Box
                sx={{
                  py: 7,
                  textAlign: "center",
                }}
              >
                <PersonAddIcon
                  sx={{
                    fontSize: 46,
                    color: "text.disabled",
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  No users found
                </Typography>
              </Box>
            ) : (
              filteredUsers.map((user) => (
                <Paper
                  key={user.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(
                          user.username
                        )}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>
                          {user.username}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {user.email}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={getRoleLabel(
                          user.role
                        )}
                        color={getRoleColor(
                          user.role
                        )}
                      />
                    </Stack>

                    <Divider />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontFamily:
                            "monospace",
                        }}
                      >
                        {user.id}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={0.5}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            openEditModal(user)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            openDeleteDialog(user)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              ))
            )}
          </Box>
        )}
      </Paper>

      {/* -------------------------------------------------- */}
      {/* Create dialog */}
      {/* -------------------------------------------------- */}

      <Dialog
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 800,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Create user
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Add a new account to the school system.
              </Typography>
            </Box>

            <IconButton
              onClick={closeCreateModal}
              disabled={saving}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {renderUserForm()}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeCreateModal}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateUser}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={17} />
              ) : (
                <PersonAddIcon />
              )
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
            }}
          >
            {saving ? "Creating..." : "Create user"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------------------------------------------------- */}
      {/* Edit dialog */}
      {/* -------------------------------------------------- */}

      <Dialog
        open={isEditModalOpen}
        onClose={closeEditModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 800,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Edit user
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Update this user's account details.
              </Typography>
            </Box>

            <IconButton
              onClick={closeEditModal}
              disabled={saving}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {renderUserForm()}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeEditModal}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleEditUser}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={17} />
              ) : (
                <EditIcon />
              )
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
            }}
          >
            {saving ? "Updating..." : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------------------------------------------------- */}
      {/* Delete confirmation */}
      {/* -------------------------------------------------- */}

      <Dialog
        open={isDeleteModalOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight={800}>
          Delete user?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>
              {selectedUser?.username}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress
                  size={17}
                  color="inherit"
                />
              ) : (
                <DeleteIcon />
              )
            }
            sx={{
              borderRadius: 2,
            }}
          >
            {deleting ? "Deleting..." : "Delete user"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------------------------------------------------- */}
      {/* Snackbar */}
      {/* -------------------------------------------------- */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeSnackbar}
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

export default Users;