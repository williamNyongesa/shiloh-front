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
  AutoStoriesOutlined as BookIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  LibraryBooksOutlined as LibraryIcon,
  PersonOutline as AuthorIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MenuBookOutlined as CategoryIcon,
  Inventory2Outlined as InventoryIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./Overview";

const DEMO_BOOKS_KEY = "shiloh_demo_books";

const INITIAL_FORM = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publisher: "",
  year: "",
  quantity: 1,
  available: 1,
  description: "",
};

const CATEGORIES = [
  "Mathematics",
  "Science",
  "English",
  "Kiswahili",
  "History",
  "Geography",
  "Computer Science",
  "Business",
  "Literature",
  "Religious Studies",
  "General",
];

const DEMO_BOOKS = [
  {
    id: "BOOK-0001",
    title: "New General Mathematics",
    author: "M. J. Anyakoha",
    isbn: "9780435990067",
    category: "Mathematics",
    publisher: "Pearson",
    year: "2024",
    quantity: 25,
    available: 18,
    description: "Secondary school mathematics textbook.",
  },
  {
    id: "BOOK-0002",
    title: "Comprehensive Biology",
    author: "K. W. Njenga",
    isbn: "9789966256789",
    category: "Science",
    publisher: "Longhorn Publishers",
    year: "2023",
    quantity: 20,
    available: 14,
    description: "Biology reference and learning textbook.",
  },
  {
    id: "BOOK-0003",
    title: "Oxford English Course",
    author: "Oxford Academic Team",
    isbn: "9780198494918",
    category: "English",
    publisher: "Oxford University Press",
    year: "2024",
    quantity: 30,
    available: 26,
    description: "English language and comprehension textbook.",
  },
  {
    id: "BOOK-0004",
    title: "Introduction to Computer Science",
    author: "David Smith",
    isbn: "9780133594140",
    category: "Computer Science",
    publisher: "Pearson",
    year: "2022",
    quantity: 15,
    available: 9,
    description: "Foundational computer science textbook.",
  },
  {
    id: "BOOK-0005",
    title: "East African History",
    author: "J. O. Onyango",
    isbn: "9789966801234",
    category: "History",
    publisher: "East African Educational Publishers",
    year: "2021",
    quantity: 18,
    available: 18,
    description: "History of East Africa and the region.",
  },
];

const Books = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [books, setBooks] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);

  const [formData, setFormData] =
    useState(INITIAL_FORM);

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
   * ---------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------
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

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const getInitials = (title = "") => {
    const words = title.trim().split(/\s+/);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return title.slice(0, 2).toUpperCase() || "BK";
  };

  const getAvailability = (book) => {
    const quantity = Number(book.quantity) || 0;
    const available = Number(book.available) || 0;

    if (quantity === 0) {
      return {
        label: "No stock",
        color: "default",
      };
    }

    if (available <= 0) {
      return {
        label: "Unavailable",
        color: "error",
      };
    }

    if (available <= quantity * 0.25) {
      return {
        label: "Low stock",
        color: "warning",
      };
    }

    return {
      label: "Available",
      color: "success",
    };
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSelectedBook(null);
  };

  /*
   * ---------------------------------------------------------
   * Demo persistence
   * ---------------------------------------------------------
   */

  const getDemoBooks = () => {
    try {
      const stored =
        localStorage.getItem(DEMO_BOOKS_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "Unable to load demo books:",
        error
      );
    }

    localStorage.setItem(
      DEMO_BOOKS_KEY,
      JSON.stringify(DEMO_BOOKS)
    );

    return DEMO_BOOKS;
  };

  const saveDemoBooks = (nextBooks) => {
    localStorage.setItem(
      DEMO_BOOKS_KEY,
      JSON.stringify(nextBooks)
    );
  };

  /*
   * ---------------------------------------------------------
   * READ
   * ---------------------------------------------------------
   */

  const fetchBooks = async () => {
    setLoading(true);

    try {
      if (isDemo) {
        setBooks(getDemoBooks());
        return;
      }

      const response =
        await axiosInstance.get("/books");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.books || [];

      setBooks(data);
    } catch (error) {
      console.error(
        "Error fetching books:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to load books.",
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

    fetchBooks();
  }, [userData, navigate, isDemo]);

  /*
   * ---------------------------------------------------------
   * Form
   * ---------------------------------------------------------
   */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showMessage(
        "Book title is required.",
        "error"
      );
      return false;
    }

    if (!formData.author.trim()) {
      showMessage(
        "Author is required.",
        "error"
      );
      return false;
    }

    if (!formData.category) {
      showMessage(
        "Please select a category.",
        "error"
      );
      return false;
    }

    if (
      Number(formData.quantity) < 0 ||
      Number.isNaN(Number(formData.quantity))
    ) {
      showMessage(
        "Quantity must be a valid number.",
        "error"
      );
      return false;
    }

    if (
      Number(formData.available) < 0 ||
      Number.isNaN(Number(formData.available))
    ) {
      showMessage(
        "Available copies must be a valid number.",
        "error"
      );
      return false;
    }

    if (
      Number(formData.available) >
      Number(formData.quantity)
    ) {
      showMessage(
        "Available copies cannot exceed total quantity.",
        "error"
      );
      return false;
    }

    return true;
  };

  /*
   * ---------------------------------------------------------
   * CREATE
   * ---------------------------------------------------------
   */

  const openCreateDialog = () => {
    resetForm();
    setCreateOpen(true);
  };

  const closeCreateDialog = () => {
    if (saving) return;

    setCreateOpen(false);
    resetForm();
  };

  const handleCreateBook = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      if (isDemo) {
        const currentBooks = getDemoBooks();

        const duplicate = currentBooks.some(
          (book) =>
            book.title.toLowerCase() ===
            formData.title.trim().toLowerCase()
        );

        if (duplicate) {
          showMessage(
            "A book with this title already exists.",
            "error"
          );
          return;
        }

        const newBook = {
          id: `BOOK-${Date.now()}`,
          title: formData.title.trim(),
          author: formData.author.trim(),
          isbn: formData.isbn.trim(),
          category: formData.category,
          publisher: formData.publisher.trim(),
          year: formData.year,
          quantity: Number(formData.quantity),
          available: Number(formData.available),
          description:
            formData.description.trim(),
        };

        const nextBooks = [
          ...currentBooks,
          newBook,
        ];

        saveDemoBooks(nextBooks);
        setBooks(nextBooks);

        setCreateOpen(false);
        resetForm();

        showMessage(
          "Book added successfully."
        );

        return;
      }

      await axiosInstance.post("/books", {
        ...formData,
        quantity: Number(formData.quantity),
        available: Number(formData.available),
      });

      setCreateOpen(false);
      resetForm();

      await fetchBooks();

      showMessage(
        "Book added successfully."
      );
    } catch (error) {
      console.error(
        "Error creating book:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to create book.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * UPDATE
   * ---------------------------------------------------------
   */

  const openEditDialog = (book) => {
    setSelectedBook(book);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      category: book.category || "",
      publisher: book.publisher || "",
      year: book.year || "",
      quantity: book.quantity ?? 1,
      available: book.available ?? 1,
      description: book.description || "",
    });

    setEditOpen(true);
  };

  const closeEditDialog = () => {
    if (saving) return;

    setEditOpen(false);
    resetForm();
  };

  const handleEditBook = async () => {
    if (!selectedBook || !validateForm()) {
      return;
    }

    setSaving(true);

    try {
      if (isDemo) {
        const currentBooks = getDemoBooks();

        const duplicate = currentBooks.some(
          (book) =>
            String(book.id) !==
              String(selectedBook.id) &&
            book.title.toLowerCase() ===
              formData.title
                .trim()
                .toLowerCase()
        );

        if (duplicate) {
          showMessage(
            "Another book already uses this title.",
            "error"
          );
          return;
        }

        const nextBooks = currentBooks.map(
          (book) => {
            if (
              String(book.id) !==
              String(selectedBook.id)
            ) {
              return book;
            }

            return {
              ...book,
              title: formData.title.trim(),
              author: formData.author.trim(),
              isbn: formData.isbn.trim(),
              category: formData.category,
              publisher:
                formData.publisher.trim(),
              year: formData.year,
              quantity: Number(
                formData.quantity
              ),
              available: Number(
                formData.available
              ),
              description:
                formData.description.trim(),
            };
          }
        );

        saveDemoBooks(nextBooks);
        setBooks(nextBooks);

        setEditOpen(false);
        resetForm();

        showMessage(
          "Book updated successfully."
        );

        return;
      }

      await axiosInstance.put(
        `/books/${selectedBook.id}`,
        {
          ...formData,
          quantity: Number(
            formData.quantity
          ),
          available: Number(
            formData.available
          ),
        }
      );

      setEditOpen(false);
      resetForm();

      await fetchBooks();

      showMessage(
        "Book updated successfully."
      );
    } catch (error) {
      console.error(
        "Error updating book:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to update book.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

  const openDeleteDialog = (book) => {
    setSelectedBook(book);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setSelectedBook(null);
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    setDeleting(true);

    try {
      if (isDemo) {
        const currentBooks = getDemoBooks();

        const nextBooks = currentBooks.filter(
          (book) =>
            String(book.id) !==
            String(selectedBook.id)
        );

        saveDemoBooks(nextBooks);
        setBooks(nextBooks);

        setDeleteOpen(false);
        setSelectedBook(null);

        showMessage(
          "Book deleted successfully."
        );

        return;
      }

      await axiosInstance.delete(
        `/books/${selectedBook.id}`
      );

      setDeleteOpen(false);
      setSelectedBook(null);

      await fetchBooks();

      showMessage(
        "Book deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting book:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to delete book.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Filtering
   * ---------------------------------------------------------
   */

  const filteredBooks = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        String(book.title || "")
          .toLowerCase()
          .includes(query) ||
        String(book.author || "")
          .toLowerCase()
          .includes(query) ||
        String(book.isbn || "")
          .toLowerCase()
          .includes(query) ||
        String(book.publisher || "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        book.category === categoryFilter;

      const available =
        Number(book.available) || 0;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter ===
          "available" &&
          available > 0) ||
        (availabilityFilter ===
          "unavailable" &&
          available <= 0) ||
        (availabilityFilter ===
          "low" &&
          available > 0 &&
          available <=
            Number(book.quantity) * 0.25);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    books,
    searchQuery,
    categoryFilter,
    availabilityFilter,
  ]);

  /*
   * ---------------------------------------------------------
   * Statistics
   * ---------------------------------------------------------
   */

  const statistics = useMemo(() => {
    const totalTitles = books.length;

    const totalCopies = books.reduce(
      (sum, book) =>
        sum + (Number(book.quantity) || 0),
      0
    );

    const availableCopies = books.reduce(
      (sum, book) =>
        sum + (Number(book.available) || 0),
      0
    );

    const borrowedCopies =
      totalCopies - availableCopies;

    const lowStock = books.filter((book) => {
      const quantity =
        Number(book.quantity) || 0;
      const available =
        Number(book.available) || 0;

      return (
        available > 0 &&
        available <= quantity * 0.25
      );
    }).length;

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      borrowedCopies,
      lowStock,
    };
  }, [books]);

  /*
   * ---------------------------------------------------------
   * Form component
   * ---------------------------------------------------------
   */

  const renderBookForm = () => (
    <Stack spacing={2.2} sx={{ mt: 1 }}>
      <TextField
        label="Book title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        fullWidth
        autoFocus
        placeholder="Enter book title"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BookIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleInputChange}
        fullWidth
        placeholder="Author name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AuthorIcon color="action" />
            </InputAdornment>
          ),
        }}
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
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleInputChange}
          fullWidth
          placeholder="ISBN number"
        />

        <TextField
          label="Publication year"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          fullWidth
          type="number"
          inputProps={{
            min: 1000,
            max: 9999,
          }}
        />
      </Box>

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>

        <Select
          name="category"
          value={formData.category}
          label="Category"
          onChange={handleInputChange}
        >
          {CATEGORIES.map((category) => (
            <MenuItem
              key={category}
              value={category}
            >
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Publisher"
        name="publisher"
        value={formData.publisher}
        onChange={handleInputChange}
        fullWidth
        placeholder="Publisher"
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
          label="Total copies"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleInputChange}
          fullWidth
          inputProps={{
            min: 0,
          }}
        />

        <TextField
          label="Available copies"
          name="available"
          type="number"
          value={formData.available}
          onChange={handleInputChange}
          fullWidth
          inputProps={{
            min: 0,
          }}
        />
      </Box>

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        fullWidth
        multiline
        minRows={3}
        placeholder="Short description of the book"
      />
    </Stack>
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
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: "primary.main",
              }}
            >
              <LibraryIcon />
            </Avatar>

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
                Library Books
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.3 }}
              >
                Manage textbooks, references and
                library inventory.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          width={{
            xs: "100%",
            sm: "auto",
          }}
        >
          <Tooltip title="Refresh books">
            <IconButton
              onClick={fetchBooks}
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
            onClick={openCreateDialog}
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
            Add Book
          </Button>
        </Stack>
      </Box>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

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
            label: "Book Titles",
            value: statistics.totalTitles,
            icon: <BookIcon />,
          },
          {
            label: "Total Copies",
            value: statistics.totalCopies,
            icon: <InventoryIcon />,
          },
          {
            label: "Available",
            value: statistics.availableCopies,
            icon: <LibraryIcon />,
          },
          {
            label: "Borrowed",
            value: statistics.borrowedCopies,
            icon: <CategoryIcon />,
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
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
                  {stat.label}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  {loading ? (
                    <Skeleton width={50} />
                  ) : (
                    stat.value
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
                {stat.icon}
              </Avatar>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* =====================================================
          LOW STOCK ALERT
      ====================================================== */}

      {!loading && statistics.lowStock > 0 && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2.5,
          }}
        >
          <strong>
            {statistics.lowStock}
          </strong>{" "}
          {statistics.lowStock === 1
            ? "book is"
            : "books are"}{" "}
          running low on available copies.
        </Alert>
      )}

      {/* =====================================================
          BOOK TABLE
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {/* Filters */}

        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1.5,
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <TextField
            size="small"
            placeholder="Search books, authors, ISBN..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            sx={{
              flex: 1,
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
                md: 190,
              },
            }}
          >
            <InputLabel>
              Category
            </InputLabel>

            <Select
              value={categoryFilter}
              label="Category"
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="all">
                All categories
              </MenuItem>

              {CATEGORIES.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                md: 170,
              },
            }}
          >
            <InputLabel>
              Availability
            </InputLabel>

            <Select
              value={availabilityFilter}
              label="Availability"
              onChange={(event) =>
                setAvailabilityFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="all">
                All books
              </MenuItem>

              <MenuItem value="available">
                Available
              </MenuItem>

              <MenuItem value="low">
                Low stock
              </MenuItem>

              <MenuItem value="unavailable">
                Unavailable
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing{" "}
            <strong>
              {filteredBooks.length}
            </strong>{" "}
            of{" "}
            <strong>{books.length}</strong>{" "}
            books
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

        {/* =================================================
            DESKTOP TABLE
        ================================================== */}

        {!isMobile ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor:
                      "action.hover",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Book
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Author
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Category
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Inventory
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 700 }}
                  >
                    Status
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
                  Array.from({
                    length: 6,
                  }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton width={220} />
                      </TableCell>

                      <TableCell>
                        <Skeleton width={150} />
                      </TableCell>

                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>

                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>

                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>

                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredBooks.length ===
                  0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 8 }}
                    >
                      <BookIcon
                        sx={{
                          fontSize: 48,
                          color:
                            "text.disabled",
                        }}
                      />

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mt: 1 }}
                      >
                        No books found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Try changing your
                        filters or add a new
                        book.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map(
                    (book) => {
                      const status =
                        getAvailability(book);

                      return (
                        <TableRow
                          key={book.id}
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
                                  width: 42,
                                  height: 42,
                                  borderRadius: 2,
                                  bgcolor:
                                    "primary.main",
                                  fontWeight: 700,
                                  fontSize: 13,
                                }}
                              >
                                {getInitials(
                                  book.title
                                )}
                              </Avatar>

                              <Box>
                                <Typography
                                  fontWeight={700}
                                  sx={{
                                    maxWidth: 260,
                                  }}
                                >
                                  {book.title}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {book.isbn
                                    ? `ISBN: ${book.isbn}`
                                    : "No ISBN"}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="body2"
                            >
                              {book.author ||
                                "—"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                book.category ||
                                "General"
                              }
                              variant="outlined"
                            />
                          </TableCell>

                          <TableCell>
                            <Stack spacing={0.3}>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                              >
                                {book.available ??
                                  0}{" "}
                                /{" "}
                                {book.quantity ??
                                  0}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                available
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                status.label
                              }
                              color={
                                status.color
                              }
                              variant="outlined"
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                              spacing={0.5}
                            >
                              <Tooltip title="Edit book">
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    openEditDialog(
                                      book
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete book">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    openDeleteDialog(
                                      book
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* =================================================
             MOBILE CARDS
          ================================================== */

          <Box sx={{ p: 1.5 }}>
            {loading ? (
              Array.from({
                length: 5,
              }).map((_, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    border: "1px solid",
                    borderColor:
                      "divider",
                    borderRadius: 2.5,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                  >
                    <Skeleton
                      variant="rounded"
                      width={44}
                      height={44}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" />
                      <Skeleton width="85%" />
                      <Skeleton width="40%" />
                    </Box>
                  </Stack>
                </Paper>
              ))
            ) : filteredBooks.length ===
              0 ? (
              <Box
                sx={{
                  py: 7,
                  textAlign: "center",
                }}
              >
                <BookIcon
                  sx={{
                    fontSize: 48,
                    color:
                      "text.disabled",
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  No books found
                </Typography>
              </Box>
            ) : (
              filteredBooks.map((book) => {
                const status =
                  getAvailability(book);

                return (
                  <Paper
                    key={book.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      border: "1px solid",
                      borderColor:
                        "divider",
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
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor:
                              "primary.main",
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(
                            book.title
                          )}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            fontWeight={700}
                          >
                            {book.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {book.author}
                          </Typography>
                        </Box>

                        <Chip
                          size="small"
                          label={
                            status.label
                          }
                          color={
                            status.color
                          }
                        />
                      </Stack>

                      <Divider />

                      <Stack spacing={0.8}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Category
                          </Typography>

                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {book.category ||
                              "General"}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Inventory
                          </Typography>

                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {book.available ??
                              0}{" "}
                            /{" "}
                            {book.quantity ??
                              0}{" "}
                            available
                          </Typography>
                        </Stack>

                        {book.isbn && (
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              ISBN
                            </Typography>

                            <Typography
                              variant="body2"
                              fontWeight={600}
                            >
                              {book.isbn}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Divider />

                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        <Button
                          size="small"
                          startIcon={
                            <EditIcon />
                          }
                          onClick={() =>
                            openEditDialog(
                              book
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <DeleteIcon />
                          }
                          onClick={() =>
                            openDeleteDialog(
                              book
                            )
                          }
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })
            )}
          </Box>
        )}
      </Paper>

      {/* =====================================================
          CREATE BOOK DIALOG
      ====================================================== */}

      <Dialog
        open={createOpen}
        onClose={closeCreateDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
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
                Add new book
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Add a book to the school
                library.
              </Typography>
            </Box>

            <IconButton
              onClick={closeCreateDialog}
              disabled={saving}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {renderBookForm()}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeCreateDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateBook}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress
                  size={17}
                />
              ) : (
                <AddIcon />
              )
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
            }}
          >
            {saving
              ? "Adding..."
              : "Add book"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          EDIT BOOK DIALOG
      ====================================================== */}

      <Dialog
        open={editOpen}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
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
                Edit book
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Update library book details.
              </Typography>
            </Box>

            <IconButton
              onClick={closeEditDialog}
              disabled={saving}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {renderBookForm()}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeEditDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleEditBook}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress
                  size={17}
                />
              ) : (
                <EditIcon />
              )
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
            }}
          >
            {saving
              ? "Saving..."
              : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DELETE DIALOG
      ====================================================== */}

      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight={800}>
          Delete book?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>
              {selectedBook?.title}
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
            onClick={handleDeleteBook}
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
            {deleting
              ? "Deleting..."
              : "Delete book"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          SNACKBAR
      ====================================================== */}

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

export default Books;