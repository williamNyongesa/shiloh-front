import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Skeleton,
  Card,
  CardContent,
  CardActions,
  Paper,
} from "@mui/material";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("https://shiloh-server.onrender.com//quizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch quizess");
        }
        const data = await response.json();
        setQuizzes(data.quizzes || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setLoading(true);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizSelection = (quizId) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    setSelectedQuiz(quiz);
    setAnswers({}); // Clear previous answers when selecting a new quiz
    setCurrentQuestionIndex(0); // Reset to the first question
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    // Calculate score
    let score = 0;
    selectedQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });

    // Show the result in a Snackbar
    setSnackbarSeverity(score === selectedQuiz.questions.length ? "success" : "error");
    setSnackbarMessage(`Your score is: ${score} out of ${selectedQuiz.questions.length}`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        padding: 2,
        margin: 5,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom color="secondary">
        Quizzes for Students
      </Typography>

      {loading ? (
        <Box sx={{ width: "100%", maxWidth: 600, color: 'GrayText' }}>
          {/* Skeleton loader for quizzes */}
          <Skeleton variant="text" width="100%" height={50} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select a quiz to attempt:
          </Typography>
          {quizzes.length === 0 ? (
            <Typography>No quizzes available at the moment.</Typography>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz.id} sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6">{quiz.title}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleQuizSelection(quiz.id)}
                    sx={{ ml: 1 }}
                  >
                    Start Quiz
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </>
      )}

      {selectedQuiz && selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            {selectedQuiz.title}
          </Typography>

          <Paper sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }} color="primary">
              {selectedQuiz.questions[currentQuestionIndex].text}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={answers[selectedQuiz.questions[currentQuestionIndex].id] || ""}
                onChange={(e) => handleAnswerChange(selectedQuiz.questions[currentQuestionIndex].id, e.target.value)}
              >
                {selectedQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            )}
          </Box>
        </Box>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizzesPage;
