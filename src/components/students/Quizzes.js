import React, { useEffect, useMemo, useState } from "react";
import {
  AccessTime,
  ArrowBack,
  ArrowForward,
  Check,
  CheckCircle,
  Close,
  EmojiEvents,
  Flag,
  InfoOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  MenuBook,
  PlayArrow,
  Refresh,
  Schedule,
  Star,
  Timer,
  TrendingUp,
  WarningAmber,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Radio,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { getDemoUser } from "../../demoData";

/*
|--------------------------------------------------------------------------
| Demo quiz data
|--------------------------------------------------------------------------
| The component also accepts your existing API shape.
|
| Expected quiz:
|
| {
|   id,
|   title,
|   description,
|   difficulty,
|   duration,
|   passingScore,
|   attempts,
|   questions: [
|     {
|       id,
|       text,
|       options: [],
|       correctAnswer
|     }
|   ]
| }
|--------------------------------------------------------------------------
*/

const demoQuizzes = [
  {
    id: "quiz-cs-01",
    title: "Algorithms & Computational Thinking",
    description:
      "Test your understanding of algorithms, problem solving and computational thinking.",
    category: "Computer Science",
    difficulty: "Intermediate",
    duration: 12,
    passingScore: 70,
    attempts: 2,
    questions: [
      {
        id: "cs-q1",
        text: "What is an algorithm?",
        options: [
          "A programming language",
          "A step-by-step procedure for solving a problem",
          "A computer operating system",
          "A type of database",
        ],
        correctAnswer:
          "A step-by-step procedure for solving a problem",
        explanation:
          "An algorithm is a finite sequence of well-defined steps used to solve a problem or accomplish a task.",
      },
      {
        id: "cs-q2",
        text: "Which data structure follows the FIFO principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: "Queue",
        explanation:
          "FIFO means First In, First Out. Queues remove elements in the same order they were added.",
      },
      {
        id: "cs-q3",
        text: "What does a loop allow a program to do?",
        options: [
          "Store images",
          "Repeat instructions",
          "Create a database",
          "Compile source code",
        ],
        correctAnswer: "Repeat instructions",
        explanation:
          "Loops allow a block of instructions to execute repeatedly while a condition is satisfied.",
      },
      {
        id: "cs-q4",
        text: "Which is an example of a conditional statement?",
        options: [
          "if / else",
          "for",
          "array",
          "function parameter",
        ],
        correctAnswer: "if / else",
        explanation:
          "Conditional statements allow programs to choose between different execution paths.",
      },
      {
        id: "cs-q5",
        text: "What is the main purpose of pseudocode?",
        options: [
          "To execute a program",
          "To replace a compiler",
          "To describe an algorithm in a human-readable way",
          "To store data permanently",
        ],
        correctAnswer:
          "To describe an algorithm in a human-readable way",
        explanation:
          "Pseudocode communicates program logic without requiring a specific programming language.",
      },
    ],
  },

  {
    id: "quiz-creative-01",
    title: "Creative Problem Solving",
    description:
      "Explore how well you understand problem framing, ideation and solution evaluation.",
    category: "Personal Development",
    difficulty: "Beginner",
    duration: 8,
    passingScore: 70,
    attempts: 3,
    questions: [
      {
        id: "cp-q1",
        text: "What should you do before generating solutions?",
        options: [
          "Choose the first idea",
          "Understand and frame the problem",
          "Start building immediately",
          "Ask someone else to solve it",
        ],
        correctAnswer: "Understand and frame the problem",
        explanation:
          "Strong solutions usually begin with a clear understanding of the actual problem.",
      },
      {
        id: "cp-q2",
        text: "What is brainstorming primarily designed to encourage?",
        options: [
          "Immediate criticism",
          "Generating many ideas",
          "Selecting one idea immediately",
          "Avoiding unusual ideas",
        ],
        correctAnswer: "Generating many ideas",
        explanation:
          "Brainstorming encourages divergent thinking before ideas are evaluated.",
      },
      {
        id: "cp-q3",
        text: "Which question helps uncover root causes?",
        options: [
          "Who is responsible?",
          "Why is this happening?",
          "How quickly can we finish?",
          "What is the easiest solution?",
        ],
        correctAnswer: "Why is this happening?",
        explanation:
          "Repeatedly asking why can help move from symptoms toward underlying causes.",
      },
      {
        id: "cp-q4",
        text: "What is prototyping useful for?",
        options: [
          "Testing ideas early",
          "Avoiding feedback",
          "Making assumptions permanent",
          "Replacing research",
        ],
        correctAnswer: "Testing ideas early",
        explanation:
          "Prototypes make ideas tangible so they can be tested and improved before full implementation.",
      },
    ],
  },

  {
    id: "quiz-leadership-01",
    title: "Communication for Leaders",
    description:
      "Check your understanding of leadership communication, storytelling and difficult conversations.",
    category: "Leadership",
    difficulty: "Advanced",
    duration: 15,
    passingScore: 75,
    attempts: 1,
    questions: [
      {
        id: "lead-q1",
        text: "What makes communication effective for leaders?",
        options: [
          "Using complex language",
          "Being clear about the purpose and audience",
          "Speaking for as long as possible",
          "Avoiding questions",
        ],
        correctAnswer:
          "Being clear about the purpose and audience",
        explanation:
          "Effective leaders adapt their communication to the audience and desired outcome.",
      },
      {
        id: "lead-q2",
        text: "Why is storytelling useful in leadership?",
        options: [
          "It removes the need for evidence",
          "It makes ideas easier to remember and relate to",
          "It guarantees agreement",
          "It replaces strategic planning",
        ],
        correctAnswer:
          "It makes ideas easier to remember and relate to",
        explanation:
          "Stories give information context and emotional meaning, making ideas more memorable.",
      },
      {
        id: "lead-q3",
        text: "What is a good approach to a difficult conversation?",
        options: [
          "Avoid the issue",
          "Focus only on winning",
          "Address the issue directly and respectfully",
          "Wait until someone else raises it",
        ],
        correctAnswer:
          "Address the issue directly and respectfully",
        explanation:
          "Healthy difficult conversations combine honesty, respect and a focus on resolving the underlying issue.",
      },
      {
        id: "lead-q4",
        text: "Active listening involves:",
        options: [
          "Preparing your response while someone talks",
          "Interrupting to clarify everything",
          "Paying attention and checking understanding",
          "Avoiding eye contact",
        ],
        correctAnswer:
          "Paying attention and checking understanding",
        explanation:
          "Active listening requires attention, interpretation and confirmation of understanding.",
      },
    ],
  },
];

const STORAGE_KEY = "shiloh_quiz_attempts";

const getStoredAttempts = () => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );
  } catch {
    return {};
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};

const getDifficultyColor = (difficulty) => {
  if (difficulty === "Beginner") return "#0EA76A";
  if (difficulty === "Advanced") return "#F26B5E";
  return "#635BFF";
};

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attempts, setAttempts] = useState(
    getStoredAttempts()
  );

  const [confirmSubmit, setConfirmSubmit] =
    useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [filter, setFilter] = useState("All");

  /*
  |--------------------------------------------------------------------------
  | Load quizzes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const storedData = JSON.parse(
          localStorage.getItem("userDATA") || "null"
        );

        if (storedData?.demo) {
          const demoUser = getDemoUser("student");

          setQuizzes(
            demoUser?.quizzes?.length
              ? demoUser.quizzes
              : demoQuizzes
          );

          setLoading(false);
          return;
        }

        const token =
          localStorage.getItem("access_token");

        const response = await fetch(
          "https://shiloh-server-2t51.onrender.com/quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await response.json();

        setQuizzes(
          Array.isArray(data.quizzes)
            ? data.quizzes
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching quizzes:",
          error
        );

        /*
         * In development/demo environments, provide useful
         * fallback data instead of leaving the page empty.
         */
        setQuizzes(demoQuizzes);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Timer
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    if (timeRemaining <= 0) {
      if (selectedQuiz) {
        submitQuiz(true);
      }

      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    quizStarted,
    quizFinished,
    timeRemaining,
    selectedQuiz,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Derived state
  |--------------------------------------------------------------------------
  */

  const currentQuestion =
    selectedQuiz?.questions?.[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;

  const questionCount =
    selectedQuiz?.questions?.length || 0;

  const quizProgress = questionCount
    ? Math.round(
        ((currentQuestionIndex + 1) /
          questionCount) *
          100
      )
    : 0;

  const answerProgress = questionCount
    ? Math.round(
        (answeredCount / questionCount) * 100
      )
    : 0;

  const filteredQuizzes = useMemo(() => {
    if (filter === "All") return quizzes;

    return quizzes.filter(
      (quiz) => quiz.difficulty === filter
    );
  }, [quizzes, filter]);

  /*
  |--------------------------------------------------------------------------
  | Start quiz
  |--------------------------------------------------------------------------
  */

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setQuizStarted(true);

    const duration =
      Number(quiz.duration) || 10;

    setTimeRemaining(duration * 60);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Answer
  |--------------------------------------------------------------------------
  */

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const nextQuestion = () => {
    if (!currentQuestion) return;

    if (
      !answers[currentQuestion.id]
    ) {
      showMessage(
        "Please select an answer before continuing.",
        "warning"
      );

      return;
    }

    if (
      currentQuestionIndex <
      questionCount - 1
    ) {
      setCurrentQuestionIndex(
        (previous) => previous + 1
      );
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (previous) => previous - 1
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const calculateResult = () => {
    if (!selectedQuiz) return null;

    let score = 0;

    selectedQuiz.questions.forEach(
      (question) => {
        if (
          answers[question.id] ===
          question.correctAnswer
        ) {
          score += 1;
        }
      }
    );

    const percentage = Math.round(
      (score / selectedQuiz.questions.length) *
        100
    );

    const passed =
      percentage >=
      (selectedQuiz.passingScore || 70);

    return {
      score,
      percentage,
      passed,
      total:
        selectedQuiz.questions.length,
    };
  };

  const submitQuiz = (automatic = false) => {
    if (!selectedQuiz) return;

    const result = calculateResult();

    if (!result) return;

    setQuizFinished(true);
    setQuizStarted(false);
    setConfirmSubmit(false);

    const previousAttempts =
      attempts[selectedQuiz.id] || [];

    const newAttempt = {
      score: result.score,
      percentage: result.percentage,
      passed: result.passed,
      completedAt:
        new Date().toISOString(),
    };

    const updatedAttempts = {
      ...attempts,
      [selectedQuiz.id]: [
        ...previousAttempts,
        newAttempt,
      ],
    };

    setAttempts(updatedAttempts);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedAttempts)
    );

    showMessage(
      automatic
        ? "Time is up. Your quiz has been submitted."
        : "Quiz submitted successfully.",
      automatic ? "warning" : "success"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Exit quiz
  |--------------------------------------------------------------------------
  */

  const exitQuiz = () => {
    if (
      quizStarted &&
      answeredCount > 0
    ) {
      const shouldLeave = window.confirm(
        "You have unsaved quiz answers. Leave this quiz?"
      );

      if (!shouldLeave) return;
    }

    setSelectedQuiz(null);
    setQuizStarted(false);
    setQuizFinished(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const retryQuiz = () => {
    if (!selectedQuiz) return;

    startQuiz(selectedQuiz);
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

  /*
  |--------------------------------------------------------------------------
  | Quiz player
  |--------------------------------------------------------------------------
  */

  if (
    selectedQuiz &&
    quizStarted &&
    currentQuestion
  ) {
    const selectedAnswer =
      answers[currentQuestion.id];

    const timerDanger =
      timeRemaining <= 60;

    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F7FA",
          pb: 6,
        }}
      >
        {/* Top player bar */}
        <Box
          sx={{
            bgcolor: "#111116",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: 2,
            }}
          >
            <Button
              onClick={exitQuiz}
              startIcon={<ArrowBack />}
              sx={{
                color: "white",
                fontWeight: 800,
              }}
            >
              Exit quiz
            </Button>

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                flex: 1,
                maxWidth: 500,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.65,
                }}
              >
                {selectedQuiz.title}
              </Typography>

              <LinearProgress
                value={quizProgress}
                variant="determinate"
                sx={{
                  mt: 0.5,
                  height: 5,
                  borderRadius: 5,
                  bgcolor:
                    "rgba(255,255,255,.12)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#8B83FF",
                  },
                }}
              />
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Timer
                sx={{
                  color: timerDanger
                    ? "#FF7B6F"
                    : "#A9A5FF",
                }}
              />

              <Typography
                fontWeight={900}
                sx={{
                  color: timerDanger
                    ? "#FF7B6F"
                    : "white",
                }}
              >
                {formatTime(timeRemaining)}
              </Typography>
            </Stack>
          </Container>
        </Box>

        <Container
          maxWidth="xl"
          sx={{ mt: 3 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1fr) 300px",
              },
              gap: 3,
            }}
          >
            {/* Question */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor:
                    "rgba(0,0,0,.08)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: {
                      xs: 2,
                      md: 4,
                    },
                    py: 2,
                    bgcolor: "#FAFAFC",
                    borderBottom:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label={`Question ${
                        currentQuestionIndex +
                        1
                      } of ${questionCount}`}
                      size="small"
                      sx={{
                        fontWeight: 850,
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {answeredCount}/
                      {questionCount} answered
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: {
                      xs: 2.5,
                      md: 5,
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{
                      fontSize: {
                        xs: "1.65rem",
                        md: "2.2rem",
                      },
                      lineHeight: 1.25,
                    }}
                  >
                    {currentQuestion.text}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Select the best answer.
                  </Typography>

                  <Stack
                    spacing={1.5}
                    sx={{ mt: 4 }}
                  >
                    {currentQuestion.options.map(
                      (option, index) => {
                        const selected =
                          selectedAnswer ===
                          option;

                        return (
                          <Paper
                            key={option}
                            elevation={0}
                            onClick={() =>
                              handleAnswer(
                                option
                              )
                            }
                            sx={{
                              p: 2,
                              borderRadius: 2.5,
                              border:
                                "2px solid",
                              borderColor:
                                selected
                                  ? "primary.main"
                                  : "divider",
                              bgcolor:
                                selected
                                  ? "rgba(99,91,255,.07)"
                                  : "white",
                              cursor:
                                "pointer",
                              transition:
                                "all .18s ease",
                              "&:hover": {
                                borderColor:
                                  "primary.main",
                                transform:
                                  "translateY(-1px)",
                                boxShadow:
                                  "0 8px 24px rgba(0,0,0,.06)",
                              },
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                sx={{
                                  width: 38,
                                  height: 38,
                                  bgcolor:
                                    selected
                                      ? "primary.main"
                                      : "#F1F1F5",
                                  color:
                                    selected
                                      ? "white"
                                      : "text.secondary",
                                  fontWeight: 900,
                                  fontSize: 14,
                                }}
                              >
                                {String.fromCharCode(
                                  65 + index
                                )}
                              </Avatar>

                              <Typography
                                sx={{
                                  flex: 1,
                                  fontWeight:
                                    selected
                                      ? 850
                                      : 600,
                                }}
                              >
                                {option}
                              </Typography>

                              <Radio
                                checked={
                                  selected
                                }
                                onChange={() =>
                                  handleAnswer(
                                    option
                                  )
                                }
                                value={option}
                                color="primary"
                              />
                            </Stack>
                          </Paper>
                        );
                      }
                    )}
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 4 }}
                  >
                    <Button
                      onClick={
                        previousQuestion
                      }
                      disabled={
                        currentQuestionIndex ===
                        0
                      }
                      startIcon={
                        <KeyboardArrowLeft />
                      }
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      Previous
                    </Button>

                    {currentQuestionIndex <
                    questionCount - 1 ? (
                      <Button
                        variant="contained"
                        onClick={
                          nextQuestion
                        }
                        endIcon={
                          <KeyboardArrowRight />
                        }
                        sx={{
                          px: 3,
                          borderRadius: 2,
                          fontWeight: 850,
                        }}
                      >
                        Next question
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          setConfirmSubmit(
                            true
                          )
                        }
                        endIcon={
                          <Check />
                        }
                        sx={{
                          px: 3,
                          borderRadius: 2,
                          fontWeight: 850,
                        }}
                      >
                        Submit quiz
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Paper>
            </Box>

            {/* Question navigator */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                p: 2.5,
                height: "fit-content",
                position: {
                  lg: "sticky",
                },
                top: 95,
              }}
            >
              <Typography
                variant="caption"
                fontWeight={900}
                letterSpacing={1}
                color="text.secondary"
              >
                QUESTIONS
              </Typography>

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mt: 0.5 }}
              >
                Your progress
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Answered
                  </Typography>

                  <Typography
                    variant="caption"
                    fontWeight={900}
                  >
                    {answerProgress}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={answerProgress}
                  sx={{
                    mt: 0.75,
                    height: 7,
                    borderRadius: 5,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(5, 1fr)",
                  gap: 1,
                  mt: 3,
                }}
              >
                {selectedQuiz.questions.map(
                  (question, index) => {
                    const answered =
                      Boolean(
                        answers[
                          question.id
                        ]
                      );

                    const current =
                      index ===
                      currentQuestionIndex;

                    return (
                      <Button
                        key={question.id}
                        onClick={() =>
                          setCurrentQuestionIndex(
                            index
                          )
                        }
                        sx={{
                          minWidth: 0,
                          width: 42,
                          height: 42,
                          p: 0,
                          borderRadius: 1.5,
                          fontWeight: 900,
                          color: current
                            ? "white"
                            : answered
                            ? "primary.main"
                            : "text.secondary",
                          bgcolor: current
                            ? "primary.main"
                            : answered
                            ? "rgba(99,91,255,.1)"
                            : "#F4F4F7",
                        }}
                      >
                        {index + 1}
                      </Button>
                    );
                  }
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={1.25}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor:
                        "primary.main",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Current question
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor:
                        "rgba(99,91,255,.15)",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Answered
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#F4F4F7",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Not answered
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Container>

        {/* Submit confirmation */}
        <Dialog
          open={confirmSubmit}
          onClose={() =>
            setConfirmSubmit(false)
          }
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{ fontWeight: 900 }}
          >
            Submit your quiz?
          </DialogTitle>

          <DialogContent>
            <Typography color="text.secondary">
              You have answered{" "}
              <strong>
                {answeredCount}
              </strong>{" "}
              of{" "}
              <strong>
                {questionCount}
              </strong>{" "}
              questions.
            </Typography>

            {answeredCount <
              questionCount && (
              <Alert
                severity="warning"
                sx={{ mt: 2 }}
              >
                You still have unanswered
                questions. They will be
                marked incorrect.
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() =>
                setConfirmSubmit(false)
              }
            >
              Keep working
            </Button>

            <Button
              variant="contained"
              onClick={() =>
                submitQuiz(false)
              }
            >
              Submit quiz
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
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
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Results screen
  |--------------------------------------------------------------------------
  */

  if (
    selectedQuiz &&
    quizFinished
  ) {
    const result = calculateResult();

    if (!result) return null;

    return (
      <Container
        maxWidth="md"
        sx={{
          py: {
            xs: 4,
            md: 7,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              py: 5,
              px: 3,
              textAlign: "center",
              background: result.passed
                ? "linear-gradient(135deg,#635BFF,#817AFF)"
                : "linear-gradient(135deg,#F26B5E,#E34D40)",
              color: "white",
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                mx: "auto",
                bgcolor:
                  "rgba(255,255,255,.15)",
                color: "white",
              }}
            >
              {result.passed ? (
                <EmojiEvents
                  sx={{ fontSize: 38 }}
                />
              ) : (
                <Refresh
                  sx={{ fontSize: 38 }}
                />
              )}
            </Avatar>

            <Typography
              variant="h4"
              fontWeight={950}
              sx={{ mt: 2 }}
            >
              {result.passed
                ? "Great work!"
                : "Keep practicing!"}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                color:
                  "rgba(255,255,255,.78)",
              }}
            >
              {selectedQuiz.title}
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3,1fr)",
                },
                gap: 1.5,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#F7F7FA",
                  borderRadius: 2.5,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={950}
                  color="primary.main"
                >
                  {result.percentage}%
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Score
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#F7F7FA",
                  borderRadius: 2.5,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={950}
                >
                  {result.score}/
                  {result.total}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Correct
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#F7F7FA",
                  borderRadius: 2.5,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={950}
                >
                  {selectedQuiz.passingScore ||
                    70}
                  %
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Pass mark
                </Typography>
              </Paper>
            </Box>

            <Alert
              severity={
                result.passed
                  ? "success"
                  : "info"
              }
              sx={{ mt: 3 }}
            >
              {result.passed
                ? `You passed this quiz with ${result.percentage}%. Excellent progress.`
                : `You scored ${result.percentage}%. Review the answers below and try again.`}
            </Alert>

            <Typography
              variant="h6"
              fontWeight={900}
              sx={{ mt: 4, mb: 1.5 }}
            >
              Review your answers
            </Typography>

            <Stack spacing={1.5}>
              {selectedQuiz.questions.map(
                (question, index) => {
                  const userAnswer =
                    answers[question.id];

                  const correct =
                    userAnswer ===
                    question.correctAnswer;

                  return (
                    <Paper
                      key={question.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: "1px solid",
                        borderColor: correct
                          ? "#B7E5D1"
                          : "#FFD0CA",
                        bgcolor: correct
                          ? "#F5FCF8"
                          : "#FFF8F7",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: correct
                              ? "#DDF5E9"
                              : "#FFE5E1",
                            color: correct
                              ? "#0E9F6E"
                              : "#E34D40",
                          }}
                        >
                          {correct ? (
                            <Check
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          ) : (
                            <Close
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          )}
                        </Avatar>

                        <Box
                          sx={{ flex: 1 }}
                        >
                          <Typography
                            fontWeight={850}
                          >
                            {index + 1}.{" "}
                            {question.text}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              color:
                                correct
                                  ? "success.dark"
                                  : "error.dark",
                            }}
                          >
                            Your answer:{" "}
                            {userAnswer ||
                              "Not answered"}
                          </Typography>

                          {!correct && (
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 0.5,
                                color:
                                  "success.dark",
                                fontWeight: 700,
                              }}
                            >
                              Correct answer:{" "}
                              {
                                question.correctAnswer
                              }
                            </Typography>
                          )}

                          {question.explanation && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display:
                                  "block",
                                mt: 1,
                                lineHeight: 1.5,
                              }}
                            >
                              {
                                question.explanation
                              }
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  );
                }
              )}
            </Stack>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={<Refresh />}
                onClick={retryQuiz}
                sx={{
                  borderRadius: 2,
                  fontWeight: 850,
                }}
              >
                Try again
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => {
                  setSelectedQuiz(null);
                  setQuizFinished(false);
                  setAnswers({});
                }}
                sx={{
                  borderRadius: 2,
                  fontWeight: 850,
                }}
              >
                Back to quizzes
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Quiz library
  |--------------------------------------------------------------------------
  */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F7FA",
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "primary.main",
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: 1.5,
            }}
          >
            KNOWLEDGE CHECK
          </Typography>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              md: "flex-end",
            }}
            gap={2}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight={950}
                sx={{
                  mt: 0.5,
                  fontSize: {
                    xs: "2rem",
                    md: "3rem",
                  },
                }}
              >
                Test what you know.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 650,
                }}
              >
                Complete quizzes, discover what you've
                mastered and identify where you can
                improve.
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor:
                      "rgba(99,91,255,.1)",
                    color:
                      "primary.main",
                  }}
                >
                  <TrendingUp />
                </Avatar>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    QUIZZES AVAILABLE
                  </Typography>

                  <Typography
                    fontWeight={950}
                  >
                    {quizzes.length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>

        {/* Filters */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 3,
            overflowX: "auto",
            pb: 0.5,
          }}
        >
          {[
            "All",
            "Beginner",
            "Intermediate",
            "Advanced",
          ].map((item) => (
            <Chip
              key={item}
              label={item}
              onClick={() =>
                setFilter(item)
              }
              sx={{
                height: 38,
                px: 1,
                fontWeight: 850,
                bgcolor:
                  filter === item
                    ? "primary.main"
                    : "white",
                color:
                  filter === item
                    ? "white"
                    : "text.primary",
                border:
                  filter === item
                    ? "none"
                    : "1px solid #E4E4EA",
              }}
            />
          ))}
        </Stack>

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2,1fr)",
              },
              gap: 2.5,
            }}
          >
            {[1, 2, 3].map(
              (item) => (
                <Paper
                  key={item}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                  }}
                >
                  <Skeleton
                    width="40%"
                    height={30}
                  />
                  <Skeleton
                    width="90%"
                    height={45}
                  />
                  <Skeleton
                    width="70%"
                    height={25}
                  />
                  <Skeleton
                    variant="rounded"
                    height={48}
                    sx={{ mt: 2 }}
                  />
                </Paper>
              )
            )}
          </Box>
        )}

        {/* Empty */}
        {!loading &&
          filteredQuizzes.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor:
                  "divider",
              }}
            >
              <MenuBook
                sx={{
                  fontSize: 52,
                  color:
                    "text.secondary",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mt: 1 }}
              >
                No quizzes found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Try another difficulty
                level.
              </Typography>
            </Paper>
          )}

        {/* Quiz cards */}
        {!loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2,1fr)",
              },
              gap: 2.5,
            }}
          >
            {filteredQuizzes.map(
              (quiz) => {
                const difficultyColor =
                  getDifficultyColor(
                    quiz.difficulty
                  );

                const quizAttempts =
                  attempts[quiz.id] ||
                  [];

                const latestAttempt =
                  quizAttempts[
                    quizAttempts.length - 1
                  ];

                const bestScore =
                  quizAttempts.length
                    ? Math.max(
                        ...quizAttempts.map(
                          (attempt) =>
                            attempt.percentage
                        )
                      )
                    : null;

                return (
                  <Paper
                    key={quiz.id}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor:
                        "divider",
                      overflow:
                        "hidden",
                      transition:
                        "all .2s ease",
                      "&:hover": {
                        transform:
                          "translateY(-4px)",
                        boxShadow:
                          "0 18px 45px rgba(0,0,0,.08)",
                      },
                    }}
                  >
                    {/* Card top */}
                    <Box
                      sx={{
                        p: 2.5,
                        background: `linear-gradient(135deg, ${difficultyColor}, ${difficultyColor}CC)`,
                        color: "white",
                        position:
                          "relative",
                        overflow:
                          "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position:
                            "absolute",
                          width: 180,
                          height: 180,
                          borderRadius:
                            "50%",
                          bgcolor:
                            "rgba(255,255,255,.08)",
                          right: -70,
                          top: -80,
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{
                          position:
                            "relative",
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor:
                              "rgba(255,255,255,.15)",
                            color: "white",
                            width: 50,
                            height: 50,
                          }}
                        >
                          <MenuBook />
                        </Avatar>

                        <Chip
                          label={
                            quiz.difficulty ||
                            "Intermediate"
                          }
                          size="small"
                          sx={{
                            color: "white",
                            bgcolor:
                              "rgba(0,0,0,.14)",
                            fontWeight: 850,
                          }}
                        />
                      </Stack>

                      <Typography
                        variant="h5"
                        fontWeight={950}
                        sx={{
                          mt: 3,
                          maxWidth: 500,
                          position:
                            "relative",
                        }}
                      >
                        {quiz.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.75,
                          color:
                            "rgba(255,255,255,.78)",
                          position:
                            "relative",
                        }}
                      >
                        {quiz.category ||
                          "Learning assessment"}
                      </Typography>
                    </Box>

                    <Box sx={{ p: 2.5 }}>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                          lineHeight: 1.6,
                          minHeight: 48,
                        }}
                      >
                        {quiz.description ||
                          "Check your understanding and discover where you can improve."}
                      </Typography>

                      <Box
                        sx={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(3,1fr)",
                          gap: 1,
                          mt: 2.5,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.7}
                          alignItems="center"
                        >
                          <Schedule
                            sx={{
                              fontSize: 18,
                              color:
                                "text.secondary",
                            }}
                          />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              TIME
                            </Typography>

                            <Typography
                              variant="body2"
                              fontWeight={850}
                            >
                              {quiz.duration ||
                                10}
                              min
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={0.7}
                          alignItems="center"
                        >
                          <MenuBook
                            sx={{
                              fontSize: 18,
                              color:
                                "text.secondary",
                            }}
                          />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              QUESTIONS
                            </Typography>

                            <Typography
                              variant="body2"
                              fontWeight={850}
                            >
                              {
                                quiz
                                  .questions
                                  ?.length
                              }
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={0.7}
                          alignItems="center"
                        >
                          <Flag
                            sx={{
                              fontSize: 18,
                              color:
                                "text.secondary",
                            }}
                          />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              PASS
                            </Typography>

                            <Typography
                              variant="body2"
                              fontWeight={850}
                            >
                              {quiz.passingScore ||
                                70}
                              %
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Previous result */}
                      {latestAttempt && (
                        <Paper
                          elevation={0}
                          sx={{
                            mt: 2,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor:
                              latestAttempt.passed
                                ? "#F1FBF6"
                                : "#FFF6F4",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              {latestAttempt.passed ? (
                                <CheckCircle
                                  sx={{
                                    color:
                                      "success.main",
                                    fontSize: 19,
                                  }}
                                />
                              ) : (
                                <WarningAmber
                                  sx={{
                                    color:
                                      "warning.main",
                                    fontSize: 19,
                                  }}
                                />
                              )}

                              <Typography
                                variant="body2"
                                fontWeight={800}
                              >
                                Last score
                              </Typography>
                            </Stack>

                            <Typography
                              fontWeight={950}
                            >
                              {
                                latestAttempt.percentage
                              }
                              %
                            </Typography>
                          </Stack>
                        </Paper>
                      )}

                      {/* Action */}
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrow />}
                        onClick={() =>
                          startQuiz(quiz)
                        }
                        sx={{
                          mt: 2.5,
                          borderRadius: 2,
                          py: 1.25,
                          fontWeight: 900,
                        }}
                      >
                        {latestAttempt
                          ? "Retake quiz"
                          : "Start quiz"}
                      </Button>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mt: 1.5 }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {quizAttempts.length}/
                          {quiz.attempts ||
                            3} attempts
                        </Typography>

                        {bestScore !==
                          null && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={800}
                          >
                            Best:{" "}
                            {bestScore}%
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Paper>
                );
              }
            )}
          </Box>
        )}

        {/* Footer information */}
        {!loading &&
          quizzes.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2.5,
                bgcolor:
                  "rgba(99,91,255,.05)",
                border: "1px solid",
                borderColor:
                  "rgba(99,91,255,.12)",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
                alignItems={{
                  sm: "center",
                }}
              >
                <InfoOutlined
                  sx={{
                    color:
                      "primary.main",
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Take your time, read every
                  question carefully, and use the
                  review screen to learn from your
                  mistakes.
                </Typography>
              </Stack>
            </Paper>
          )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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

export default QuizzesPage;
