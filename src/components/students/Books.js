import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AutoStories,
  Book,
  Bookmark,
  BookmarkBorder,
  Close,
  MenuBook,
  Search,
  Visibility,
} from "@mui/icons-material";
import { axiosInstance } from "../admin/Overview";
import { getDemoUser } from "../../demoData";

const DEMO_BOOKS_KEY = "shiloh_demo_books";

const seedBooks = [
  {
    id: "BOOK-001",
    title: "The River Between",
    author: "Ngũgĩ wa Thiong'o",
    category: "Literature",
    isbn: "9780435905486",
    description:
      "A classic Kenyan novel exploring cultural conflict, tradition, identity, and the impact of colonialism on communities.",
    year: 1965,
    pages: 152,
    status: "Available",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BOOK-002",
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    category: "Literature",
    isbn: "9780385474542",
    description:
      "The story of Okonkwo and his community as traditional Igbo society faces major social and cultural changes.",
    year: 1958,
    pages: 209,
    status: "Available",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BOOK-003",
    title: "Introduction to Biology",
    author: "Jane Collins",
    category: "Science",
    isbn: "9780198398917",
    description:
      "An introductory biology textbook covering cells, genetics, ecology, evolution, and human biology.",
    year: 2024,
    pages: 384,
    status: "Available",
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BOOK-004",
    title: "Essential Mathematics",
    author: "David Brown",
    category: "Mathematics",
    isbn: "9781107616358",
    description:
      "A practical mathematics textbook covering algebra, geometry, statistics, probability, and problem solving.",
    year: 2023,
    pages: 420,
    status: "Available",
    cover:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BOOK-005",
    title: "Computer Science Fundamentals",
    author: "Michael Anderson",
    category: "Computer Science",
    isbn: "9780134878881",
    description:
      "Learn the fundamentals of computer science, algorithms, programming concepts, databases, and networks.",
    year: 2025,
    pages: 510,
    status: "Available",
    cover:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BOOK-006",
    title: "World History",
    author: "Robert Wilson",
    category: "History",
    isbn: "9780190840612",
    description:
      "A comprehensive introduction to major civilizations, historical events, political movements, and global change.",
    year: 2022,
    pages: 465,
    status: "Issued",
    cover:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = [
  "All",
  "Literature",
  "Science",
  "Mathematics",
  "Computer Science",
  "History",
];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);

  const [savedBooks, setSavedBooks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shiloh_saved_books") || "[]");
    } catch {
      return [];
    }
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const loadBooks = async () => {
    setLoading(true);

    try {
      const userData = JSON.parse(
        localStorage.getItem("userDATA") || "null"
      );

      if (userData?.demo) {
        const stored = localStorage.getItem(DEMO_BOOKS_KEY);

        if (stored) {
          setBooks(JSON.parse(stored));
        } else {
          const demoUser = getDemoUser("admin");

          const demoBooks =
            demoUser?.books?.length > 0 ? demoUser.books : seedBooks;

          setBooks(demoBooks);
          localStorage.setItem(
            DEMO_BOOKS_KEY,
            JSON.stringify(demoBooks)
          );
        }

        return;
      }

      const response = await axiosInstance.get("/books");

      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading books:", error);

      showMessage(
        "Unable to load books. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query) ||
        book.category?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const toggleSavedBook = (bookId) => {
    setSavedBooks((previous) => {
      const exists = previous.includes(bookId);

      const updated = exists
        ? previous.filter((id) => id !== bookId)
        : [...previous, bookId];

      localStorage.setItem(
        "shiloh_saved_books",
        JSON.stringify(updated)
      );

      showMessage(
        exists
          ? "Book removed from your saved list."
          : "Book saved for later."
      );

      return updated;
    });
  };

  const handleReadBook = (book) => {
    if (book.status === "Issued") {
      showMessage(
        "This physical copy is currently issued. You can still view its details.",
        "warning"
      );
    }

    setSelectedBook(book);
  };

  const availableCount = books.filter(
    (book) => book.status === "Available"
  ).length;

  const categoryCount = new Set(
    books.map((book) => book.category).filter(Boolean)
  ).size;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">
            Loading library...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 4 },
      }}
    >
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          mb: 4,
          color: "white",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #0891b2 100%)",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
            right: -60,
            top: -90,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.06)",
            right: 130,
            bottom: -90,
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Avatar
            sx={{
              width: 58,
              height: 58,
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <AutoStories />
          </Avatar>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ fontSize: { xs: "1.8rem", md: "2.25rem" } }}
            >
              School Library
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Discover textbooks, literature and learning resources.
            </Typography>
          </Box>
        </Stack>

        <Grid
          container
          spacing={2}
          sx={{
            position: "relative",
            zIndex: 1,
            mt: 3,
            maxWidth: 760,
          }}
        >
          <Grid item xs={12} sm={4}>
            <LibraryStat
              icon={<MenuBook />}
              value={books.length}
              label="Total books"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <LibraryStat
              icon={<Book />}
              value={availableCount}
              label="Available"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <LibraryStat
              icon={<AutoStories />}
              value={categoryCount}
              label="Categories"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Controls */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, author, ISBN or category..."
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
          onChange={(event) => setCategory(event.target.value)}
          sx={{
            minWidth: { xs: "100%", md: 210 },
            borderRadius: 3,
          }}
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {/* Result information */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight={700}>
          Library Collection
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {filteredBooks.length}{" "}
          {filteredBooks.length === 1 ? "book" : "books"}
        </Typography>
      </Stack>

      {/* Books */}
      {filteredBooks.length === 0 ? (
        <Card
          sx={{
            borderRadius: 4,
            p: 6,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              mb: 2,
              width: 64,
              height: 64,
              bgcolor: "action.hover",
            }}
          >
            <MenuBook />
          </Avatar>

          <Typography variant="h6" fontWeight={700}>
            No books found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try another search term or select a different category.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => {
            const isSaved = savedBooks.includes(book.id);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition:
                      "transform .25s ease, box-shadow .25s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 230,
                      position: "relative",
                      overflow: "hidden",
                      bgcolor: "action.hover",
                    }}
                  >
                    {book.cover ? (
                      <Box
                        component="img"
                        src={book.cover}
                        alt={book.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%" }}
                      >
                        <MenuBook
                          sx={{
                            fontSize: 70,
                            color: "text.disabled",
                          }}
                        />
                      </Stack>
                    )}

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,.55), transparent 55%)",
                      }}
                    />

                    <Chip
                      label={book.status || "Available"}
                      size="small"
                      color={
                        book.status === "Issued"
                          ? "warning"
                          : "success"
                      }
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        fontWeight: 700,
                      }}
                    />

                    <Tooltip
                      title={
                        isSaved
                          ? "Remove from saved books"
                          : "Save book"
                      }
                    >
                      <IconButton
                        onClick={() => toggleSavedBook(book.id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "white",
                          bgcolor: "rgba(0,0,0,.35)",
                          backdropFilter: "blur(8px)",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,.55)",
                          },
                        }}
                      >
                        {isSaved ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Chip
                      label={book.category || "General"}
                      size="small"
                      variant="outlined"
                      sx={{
                        alignSelf: "flex-start",
                        mb: 1.5,
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={750}
                      sx={{
                        lineHeight: 1.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {book.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.75 }}
                    >
                      {book.author}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {book.pages ? `${book.pages} pages` : ""}
                      {book.pages && book.year ? " • " : ""}
                      {book.year || ""}
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => handleReadBook(book)}
                      sx={{
                        mt: 2,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Read Book
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Book Reader / Details */}
      <Dialog
        open={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        {selectedBook && (
          <>
            <DialogTitle sx={{ p: 0 }}>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 220, sm: 280 },
                  overflow: "hidden",
                }}
              >
                {selectedBook.cover ? (
                  <Box
                    component="img"
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      height: "100%",
                      bgcolor: "action.hover",
                    }}
                  >
                    <MenuBook sx={{ fontSize: 90 }} />
                  </Stack>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.05))",
                  }}
                />

                <IconButton
                  onClick={() => setSelectedBook(null)}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    color: "white",
                    bgcolor: "rgba(0,0,0,.35)",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,.6)",
                    },
                  }}
                >
                  <Close />
                </IconButton>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: { xs: 20, sm: 30 },
                    right: 20,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      fontSize: { xs: "1.6rem", sm: "2.2rem" },
                    }}
                  >
                    {selectedBook.title}
                  </Typography>

                  <Typography sx={{ opacity: 0.8 }}>
                    {selectedBook.author}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ mb: 3 }}
              >
                <Chip
                  label={selectedBook.category}
                  color="primary"
                  variant="outlined"
                />

                {selectedBook.year && (
                  <Chip label={`Published ${selectedBook.year}`} />
                )}

                {selectedBook.pages && (
                  <Chip label={`${selectedBook.pages} pages`} />
                )}

                <Chip
                  label={selectedBook.status}
                  color={
                    selectedBook.status === "Issued"
                      ? "warning"
                      : "success"
                  }
                />
              </Stack>

              <Typography
                variant="h6"
                fontWeight={750}
                gutterBottom
              >
                About this book
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {selectedBook.description ||
                  "No description is available for this book."}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    AUTHOR
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedBook.author || "Not specified"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    ISBN
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedBook.isbn || "Not specified"}
                  </Typography>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Avatar>
                    <AutoStories />
                  </Avatar>

                  <Box>
                    <Typography fontWeight={700}>
                      Reading access
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      This library entry contains the book
                      information available to students. Digital
                      reading can be connected to your school's
                      document/PDF storage when available.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() =>
                  toggleSavedBook(selectedBook.id)
                }
                startIcon={
                  savedBooks.includes(selectedBook.id) ? (
                    <Bookmark />
                  ) : (
                    <BookmarkBorder />
                  )
                }
              >
                {savedBooks.includes(selectedBook.id)
                  ? "Saved"
                  : "Save for later"}
              </Button>

              <Button
                variant="contained"
                onClick={() => setSelectedBook(null)}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const LibraryStat = ({ icon, value, label }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: "rgba(255,255,255,0.09)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: "rgba(255,255,255,0.12)",
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography variant="h6" fontWeight={800}>
          {value}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,.65)" }}
        >
          {label}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

export default Books;
