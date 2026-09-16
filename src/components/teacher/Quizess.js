import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Add,
  ArrowForward,
  CheckCircle,
  Close,
  DeleteOutline,
  EditOutlined,
  EmojiEvents,
  ExpandMore,
  HelpOutline,
  MenuBook,
  MoreHoriz,
  PlayArrow,
  Preview,
  QuizOutlined,
  SaveOutlined,
  Search,
  SettingsOutlined,
  TimerOutlined,
  TrendingUp,
  VisibilityOutlined,
  WarningAmber,
} from "@mui/icons-material";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { getDemoUser } from "../../demoData";

const API_URL =
  "https://shiloh-server-2t51.onrender.com";

const DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const EMPTY_QUESTION = () => ({
  id: `question-${Date.now()}-${Math.random()}`,
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
});

const EMPTY_QUIZ = () => ({
  title: "",
  description: "",
  category: "",
  difficulty: "Beginner",
  duration: 10,
  passingScore: 70,
  attempts: 1,
  questions: [EMPTY_QUESTION()],
});

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
    status: "Published",
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
          "An algorithm is a finite sequence of well-defined steps used to solve a problem.",
      },
      {
        id: "cs-q2",
        text: "Which data structure follows the FIFO principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: "Queue",
        explanation:
          "FIFO means First In, First Out.",
      },
    ],
  },
  {
    id: "quiz-creative-01",
    title: "Creative Problem Solving",
    description:
      "Explore problem framing, ideation and solution evaluation.",
    category: "Personal Development",
    difficulty: "Beginner",
    duration: 8,
    passingScore: 70,
    attempts: 3,
    status: "Published",
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
        correctAnswer:
          "Understand and frame the problem",
        explanation:
          "Strong solutions usually begin with a clear understanding of the actual problem.",
      },
    ],
  },
];

const getDifficultyStyles = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return {
        color: "#087F5B",
        background: "#E7F8F1",
      };

    case "Advanced":
      return {
        color: "#C92A2A",
        background: "#FFF0EF",
      };

    default:
      return {
        color: "#5548D9",
        background: "#EFEDFF",
      };
  }
};

const createQuestionId = () =>
  `question-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

const normaliseQuiz = (quiz) => ({
  ...quiz,
  description: quiz.description || "",
  category: quiz.category || "General",
  difficulty: quiz.difficulty || "Beginner",
  duration: Number(quiz.duration) || 10,
  passingScore: Number(quiz.passingScore) || 70,
  attempts: Number(quiz.attempts) || 1,
  status: quiz.status || "Published",
  questions: Array.isArray(quiz.questions)
    ? quiz.questions.map((question) => ({
        id: question.id || createQuestionId(),
        text: question.text || "",
        options:
          Array.isArray(question.options) &&
          question.options.length
            ? question.options
            : ["", "", "", ""],
        correctAnswer:
          question.correctAnswer || "",
        explanation:
          question.explanation || "",
      }))
    : [EMPTY_QUESTION()],
});

const QuizStatsCard = ({
  icon,
  label,
  value,
  caption,
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      background:
        "linear-gradient(145deg, #ffffff 0%, #fafaff 100%)",
      transition: "all .2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow:
          "0 12px 30px rgba(20, 20, 40, .08)",
      },
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
    >
      <Avatar
        sx={{
          width: 44,
          height: 44,
          bgcolor: "rgba(99,91,255,.10)",
          color: "primary.main",
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={800}
        >
          {label}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={950}
          lineHeight={1.1}
        >
          {value}
        </Typography>

        {caption && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {caption}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const QuestionBuilder = ({
  question,
  index,
  onChange,
  onDelete,
}) => {
  const updateQuestion = (field, value) => {
    onChange({
      ...question,
      [field]: value,
    });
  };

  const updateOption = (optionIndex, value) => {
    const options = [...question.options];
    const oldValue = options[optionIndex];

    options[optionIndex] = value;

    onChange({
      ...question,
      options,
      correctAnswer:
        question.correctAnswer === oldValue
          ? value
          : question.correctAnswer,
    });
  };

  const addOption = () => {
    if (question.options.length >= 6) return;

    onChange({
      ...question,
      options: [...question.options, ""],
    });
  };

  const removeOption = (optionIndex) => {
    if (question.options.length <= 2) return;

    const removed = question.options[optionIndex];

    const options = question.options.filter(
      (_, index) => index !== optionIndex
    );

    onChange({
      ...question,
      options,
      correctAnswer:
        question.correctAnswer === removed
          ? ""
          : question.correctAnswer,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          bgcolor: "#FAFAFC",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {index + 1}
            </Avatar>

            <Box>
              <Typography
                fontWeight={900}
              >
                Question {index + 1}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Add a clear question and mark the correct answer.
              </Typography>
            </Box>
          </Stack>

          <Tooltip title="Delete question">
            <IconButton
              aria-label={`Delete question ${index + 1}`}
              onClick={onDelete}
              color="error"
              sx={{
                width: 42,
                height: 42,
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Question"
          placeholder="e.g. What is an algorithm?"
          value={question.text}
          onChange={(event) =>
            updateQuestion(
              "text",
              event.target.value
            )
          }
        />

        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {question.options.map(
            (option, optionIndex) => {
              const isCorrect =
                question.correctAnswer === option &&
                option !== "";

              return (
                <Paper
                  key={`${question.id}-option-${optionIndex}`}
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: isCorrect
                      ? "success.main"
                      : "divider",
                    background: isCorrect
                      ? "rgba(46,125,50,.045)"
                      : "#fff",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: isCorrect
                          ? "success.main"
                          : "#F1F1F5",
                        color: isCorrect
                          ? "white"
                          : "text.secondary",
                        fontWeight: 900,
                        fontSize: 13,
                      }}
                    >
                      {String.fromCharCode(
                        65 + optionIndex
                      )}
                    </Avatar>

                    <TextField
                      fullWidth
                      size="small"
                      label={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(event) =>
                        updateOption(
                          optionIndex,
                          event.target.value
                        )
                      }
                    />

                    <Tooltip
                      title={
                        isCorrect
                          ? "Correct answer"
                          : "Mark as correct"
                      }
                    >
                      <IconButton
                        aria-label={
                          isCorrect
                            ? `Option ${
                                optionIndex + 1
                              } is correct`
                            : `Mark option ${
                                optionIndex + 1
                              } as correct`
                        }
                        color={
                          isCorrect
                            ? "success"
                            : "default"
                        }
                        disabled={!option.trim()}
                        onClick={() =>
                          updateQuestion(
                            "correctAnswer",
                            option
                          )
                        }
                        sx={{
                          width: 44,
                          height: 44,
                        }}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove option">
                      <span>
                        <IconButton
                          aria-label={`Remove option ${
                            optionIndex + 1
                          }`}
                          onClick={() =>
                            removeOption(optionIndex)
                          }
                          disabled={
                            question.options.length <= 2
                          }
                          sx={{
                            width: 44,
                            height: 44,
                          }}
                        >
                          <Close />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Paper>
              );
            }
          )}
        </Stack>

        <Button
          startIcon={<Add />}
          onClick={addOption}
          disabled={question.options.length >= 6}
          sx={{
            mt: 1.5,
            fontWeight: 850,
          }}
        >
          Add option
        </Button>

        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Explanation"
          placeholder="Explain why the correct answer is correct. This helps learners after submission."
          value={question.explanation}
          onChange={(event) =>
            updateQuestion(
              "explanation",
              event.target.value
            )
          }
          sx={{ mt: 2.5 }}
        />

        {question.correctAnswer ? (
          <Alert
            severity="success"
            icon={<CheckCircle />}
            sx={{
              mt: 2,
              borderRadius: 2,
            }}
          >
            Correct answer selected.
          </Alert>
        ) : (
          <Alert
            severity="warning"
            icon={<WarningAmber />}
            sx={{
              mt: 2,
              borderRadius: 2,
            }}
          >
            Select one option as the correct answer.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

const QuizEditor = ({
  open,
  quiz,
  saving,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(
    quiz || EMPTY_QUIZ()
  );

  useEffect(() => {
    if (quiz) {
      setForm(normaliseQuiz(quiz));
    }
  }, [quiz]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateQuestion = (index, question) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map(
        (item, itemIndex) =>
          itemIndex === index
            ? question
            : item
      ),
    }));
  };

  const addQuestion = () => {
    setForm((previous) => ({
      ...previous,
      questions: [
        ...previous.questions,
        EMPTY_QUESTION(),
      ],
    }));
  };

  const deleteQuestion = (index) => {
    if (form.questions.length <= 1) return;

    setForm((previous) => ({
      ...previous,
      questions: previous.questions.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const isValid =
    form.title.trim() &&
    form.description.trim() &&
    form.questions.length > 0 &&
    form.questions.every(
      (question) =>
        question.text.trim() &&
        question.options.filter(
          (option) => option.trim()
        ).length >= 2 &&
        question.correctAnswer.trim()
    );

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      ...form,
      duration: Number(form.duration),
      passingScore: Number(form.passingScore),
      attempts: Number(form.attempts),
      questions: form.questions.map(
        (question) => ({
          ...question,
          options: question.options.filter(
            (option) => option.trim()
          ),
        })
      ),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          maxHeight: "94vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background:
              "linear-gradient(135deg,#111116 0%,#292548 100%)",
            color: "white",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Avatar
                sx={{
                  bgcolor:
                    "rgba(255,255,255,.13)",
                  color: "white",
                }}
              >
                <QuizOutlined />
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={950}
                >
                  {form.id
                    ? "Edit quiz"
                    : "Create a new quiz"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "rgba(255,255,255,.68)",
                  }}
                >
                  Build an engaging knowledge check for your learners.
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              aria-label="Close quiz editor"
              sx={{
                color: "white",
                width: 44,
                height: 44,
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          bgcolor: "#F7F7FA",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1fr) 310px",
              },
              gap: 2.5,
            }}
          >
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Quiz title"
                    placeholder="e.g. Algorithms & Computational Thinking"
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Description"
                    placeholder="Tell learners what this quiz will help them assess."
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
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
                      fullWidth
                      label="Category"
                      placeholder="Computer Science"
                      value={form.category}
                      onChange={(event) =>
                        updateField(
                          "category",
                          event.target.value
                        )
                      }
                    />

                    <TextField
                      select
                      fullWidth
                      label="Difficulty"
                      value={form.difficulty}
                      onChange={(event) =>
                        updateField(
                          "difficulty",
                          event.target.value
                        )
                      }
                    >
                      {DIFFICULTIES.map(
                        (difficulty) => (
                          <MenuItem
                            key={difficulty}
                            value={difficulty}
                          >
                            {difficulty}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Box>
                </Stack>
              </Paper>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, mb: 1.5 }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={950}
                  >
                    Questions
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Create clear multiple-choice questions and mark one correct answer.
                  </Typography>
                </Box>

                <Chip
                  label={`${form.questions.length} ${
                    form.questions.length === 1
                      ? "question"
                      : "questions"
                  }`}
                  color="primary"
                  sx={{ fontWeight: 850 }}
                />
              </Stack>

              <Stack spacing={2}>
                {form.questions.map(
                  (question, index) => (
                    <QuestionBuilder
                      key={question.id}
                      question={question}
                      index={index}
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          value
                        )
                      }
                      onDelete={() =>
                        deleteQuestion(index)
                      }
                    />
                  )
                )}
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                onClick={addQuestion}
                sx={{
                  mt: 2,
                  minHeight: 52,
                  borderRadius: 2.5,
                  fontWeight: 900,
                  borderStyle: "dashed",
                }}
              >
                Add another question
              </Button>
            </Box>

            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  position: {
                    lg: "sticky",
                  },
                  top: 16,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <SettingsOutlined
                    color="primary"
                  />

                  <Typography
                    fontWeight={950}
                  >
                    Quiz settings
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Duration"
                    value={form.duration}
                    onChange={(event) =>
                      updateField(
                        "duration",
                        event.target.value
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          min
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: 1,
                      max: 180,
                    }}
                  />

                  <TextField
                    type="number"
                    fullWidth
                    label="Passing score"
                    value={form.passingScore}
                    onChange={(event) =>
                      updateField(
                        "passingScore",
                        event.target.value
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          %
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: 1,
                      max: 100,
                    }}
                  />

                  <TextField
                    type="number"
                    fullWidth
                    label="Allowed attempts"
                    value={form.attempts}
                    onChange={(event) =>
                      updateField(
                        "attempts",
                        event.target.value
                      )
                    }
                    inputProps={{
                      min: 1,
                      max: 20,
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={850}
                >
                  CREATOR CHECKLIST
                </Typography>

                <Stack
                  spacing={1.25}
                  sx={{ mt: 1.5 }}
                >
                  <ChecklistItem
                    done={Boolean(
                      form.title.trim()
                    )}
                    label="Quiz title"
                  />

                  <ChecklistItem
                    done={Boolean(
                      form.description.trim()
                    )}
                    label="Description"
                  />

                  <ChecklistItem
                    done={
                      form.questions.length > 0
                    }
                    label="At least one question"
                  />

                  <ChecklistItem
                    done={form.questions.every(
                      (question) =>
                        question.correctAnswer
                    )}
                    label="Correct answers selected"
                  />
                </Stack>

                {!isValid && (
                  <Alert
                    severity="warning"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                    }}
                  >
                    Complete the required quiz information before saving.
                  </Alert>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "white",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            fontWeight: 850,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <SaveOutlined />
            )
          }
          disabled={!isValid || saving}
          onClick={handleSave}
          sx={{
            minHeight: 46,
            px: 2.5,
            borderRadius: 2,
            fontWeight: 900,
          }}
        >
          {saving
            ? "Saving..."
            : form.id
            ? "Save changes"
            : "Create quiz"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ChecklistItem = ({ done, label }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
  >
    <CheckCircle
      sx={{
        fontSize: 19,
        color: done
          ? "success.main"
          : "text.disabled",
      }}
    />

    <Typography
      variant="body2"
      color={
        done
          ? "text.primary"
          : "text.secondary"
      }
      fontWeight={done ? 650 : 500}
    >
      {label}
    </Typography>
  </Stack>
);

const PreviewDialog = ({
  open,
  quiz,
  onClose,
}) => {
  if (!quiz) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 950,
        }}
      >
        Quiz preview
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            p: { xs: 1, md: 2 },
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="h4"
              fontWeight={950}
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  md: "2.3rem",
                },
              }}
            >
              {quiz.title}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {quiz.description}
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ mt: 1 }}
            >
              <Chip
                label={quiz.category}
              />

              <Chip
                label={quiz.difficulty}
              />

              <Chip
                icon={<TimerOutlined />}
                label={`${quiz.duration} min`}
              />

              <Chip
                label={`Pass: ${quiz.passingScore}%`}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            {quiz.questions.map(
              (question, index) => (
                <Paper
                  key={question.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary.main"
                    fontWeight={900}
                  >
                    QUESTION {index + 1}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{ mt: 0.5 }}
                  >
                    {question.text ||
                      "Untitled question"}
                  </Typography>

                  <Stack
                    spacing={1}
                    sx={{ mt: 2 }}
                  >
                    {question.options.map(
                      (option, optionIndex) => (
                        <Box
                          key={`${question.id}-preview-${optionIndex}`}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border:
                              "1px solid",
                            borderColor:
                              option ===
                              question.correctAnswer
                                ? "success.main"
                                : "divider",
                            bgcolor:
                              option ===
                              question.correctAnswer
                                ? "rgba(46,125,50,.06)"
                                : "transparent",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: 12,
                                fontWeight: 900,
                                bgcolor:
                                  option ===
                                  question.correctAnswer
                                    ? "success.main"
                                    : "#F1F1F5",
                                color:
                                  option ===
                                  question.correctAnswer
                                    ? "white"
                                    : "text.secondary",
                              }}
                            >
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </Avatar>

                            <Typography
                              fontWeight={
                                option ===
                                question.correctAnswer
                                  ? 800
                                  : 600
                              }
                            >
                              {option}
                            </Typography>

                            {option ===
                              question.correctAnswer && (
                              <CheckCircle
                                color="success"
                                sx={{
                                  ml: "auto",
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      )
                    )}
                  </Stack>

                  {question.explanation && (
                    <Alert
                      severity="info"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                      }}
                    >
                      {question.explanation}
                    </Alert>
                  )}
                </Paper>
              )
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            fontWeight: 900,
          }}
        >
          Close preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({
  open,
  quiz,
  deleting,
  onClose,
  onConfirm,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle
      sx={{
        fontWeight: 950,
      }}
    >
      Delete quiz?
    </DialogTitle>

    <DialogContent>
      <Typography color="text.secondary">
        You are about to delete{" "}
        <strong>{quiz?.title}</strong>. This action
        cannot be undone.
      </Typography>
    </DialogContent>

    <DialogActions sx={{ p: 2 }}>
      <Button
        onClick={onClose}
        sx={{ fontWeight: 800 }}
      >
        Cancel
      </Button>

      <Button
        color="error"
        variant="contained"
        startIcon={
          deleting ? (
            <CircularProgress
              size={17}
              color="inherit"
            />
          ) : (
            <DeleteOutline />
          )
        }
        disabled={deleting}
        onClick={onConfirm}
        sx={{
          borderRadius: 2,
          fontWeight: 900,
        }}
      >
        {deleting
          ? "Deleting..."
          : "Delete quiz"}
      </Button>
    </DialogActions>
  </Dialog>
);

const QuizCard = ({
  quiz,
  onEdit,
  onPreview,
  onDelete,
  onToggleStatus,
}) => {
  const difficulty = getDifficultyStyles(
    quiz.difficulty
  );

  const questionCount =
    quiz.questions?.length || 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3.5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition:
          "transform .22s ease, box-shadow .22s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 18px 45px rgba(24,24,40,.10)",
        },
      }}
    >
      <Box
        sx={{
          minHeight: 135,
          p: 2.5,
          color: "white",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg,#111116 0%,#312C62 100%)",
          "&:after": {
            content: '""',
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            right: -55,
            top: -70,
            background:
              "rgba(139,131,255,.20)",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              width: 46,
              height: 46,
              bgcolor:
                "rgba(255,255,255,.12)",
              color: "white",
            }}
          >
            <QuizOutlined />
          </Avatar>

          <Stack
            direction="row"
            spacing={0.75}
          >
            <Chip
              size="small"
              label={
                quiz.status || "Published"
              }
              sx={{
                color: "white",
                bgcolor:
                  quiz.status === "Draft"
                    ? "rgba(255,193,7,.18)"
                    : "rgba(46,204,113,.18)",
                border:
                  "1px solid rgba(255,255,255,.15)",
                fontWeight: 800,
              }}
            />

            <Tooltip title="Quiz actions">
              <IconButton
                aria-label="Quiz actions"
                size="small"
                sx={{
                  color: "white",
                  bgcolor:
                    "rgba(255,255,255,.08)",
                  "&:hover": {
                    bgcolor:
                      "rgba(255,255,255,.16)",
                  },
                }}
              >
                <MoreHoriz />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Typography
          variant="h6"
          fontWeight={950}
          sx={{
            mt: 2,
            position: "relative",
            zIndex: 1,
            lineHeight: 1.2,
          }}
        >
          {quiz.title}
        </Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: 42,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {quiz.description ||
            "No description provided."}
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.8}
          sx={{ mt: 2 }}
        >
          <Chip
            size="small"
            label={quiz.difficulty}
            sx={{
              color: difficulty.color,
              bgcolor: difficulty.background,
              fontWeight: 850,
            }}
          />

          <Chip
            size="small"
            icon={<TimerOutlined />}
            label={`${quiz.duration} min`}
          />

          <Chip
            size="small"
            label={`${questionCount} questions`}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,1fr)",
            gap: 1,
          }}
        >
          <Metric
            label="Pass mark"
            value={`${quiz.passingScore}%`}
          />

          <Metric
            label="Attempts"
            value={quiz.attempts || 1}
          />
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 2 }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EditOutlined />}
            onClick={onEdit}
            sx={{
              borderRadius: 2,
              fontWeight: 850,
            }}
          >
            Edit
          </Button>

          <Tooltip title="Preview quiz">
            <IconButton
              aria-label={`Preview ${quiz.title}`}
              onClick={onPreview}
              sx={{
                width: 44,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <VisibilityOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete quiz">
            <IconButton
              aria-label={`Delete ${quiz.title}`}
              onClick={onDelete}
              color="error"
              sx={{
                width: 44,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Stack>

        <Button
          fullWidth
          size="small"
          startIcon={
            quiz.status === "Draft" ? (
              <PlayArrow />
            ) : (
              <SettingsOutlined />
            )
          }
          onClick={onToggleStatus}
          sx={{
            mt: 1,
            fontWeight: 800,
          }}
        >
          {quiz.status === "Draft"
            ? "Publish quiz"
            : "Move to draft"}
        </Button>
      </Box>
    </Paper>
  );
};

const Metric = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
    >
      {label}
    </Typography>

    <Typography
      fontWeight={950}
      sx={{ mt: 0.25 }}
    >
      {value}
    </Typography>
  </Box>
);

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] =
    useState("All");

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editingQuiz, setEditingQuiz] =
    useState(null);

  const [previewQuiz, setPreviewQuiz] =
    useState(null);

  const [deleteQuiz, setDeleteQuiz] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState(null);

  const [menuAnchor, setMenuAnchor] =
    useState(null);

  const token =
    localStorage.getItem("access_token");

  const isDemo = (() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("userDATA") ||
          "null"
      );

      return Boolean(data?.demo);
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);

    try {
      if (isDemo) {
        const demoUser =
          getDemoUser("teacher");

        setQuizzes(
          demoUser?.quizzes?.length
            ? demoUser.quizzes.map(normaliseQuiz)
            : demoQuizzes.map(normaliseQuiz)
        );

        return;
      }

      const response = await axios.get(
        `${API_URL}/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const serverQuizzes =
        response.data?.quizzes;

      setQuizzes(
        Array.isArray(serverQuizzes)
          ? serverQuizzes.map(normaliseQuiz)
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching quizzes:",
        error
      );

      setQuizzes(
        demoQuizzes.map(normaliseQuiz)
      );

      setMessage({
        severity: "warning",
        text: "Unable to reach the quiz server. Demo quizzes are being shown.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesSearch =
        !query ||
        quiz.title
          ?.toLowerCase()
          .includes(query) ||
        quiz.description
          ?.toLowerCase()
          .includes(query) ||
        quiz.category
          ?.toLowerCase()
          .includes(query);

      const matchesDifficulty =
        difficulty === "All" ||
        quiz.difficulty === difficulty;

      return (
        matchesSearch &&
        matchesDifficulty
      );
    });
  }, [quizzes, search, difficulty]);

  const stats = useMemo(() => {
    const totalQuestions = quizzes.reduce(
      (total, quiz) =>
        total + (quiz.questions?.length || 0),
      0
    );

    const published = quizzes.filter(
      (quiz) =>
        (quiz.status || "Published") ===
        "Published"
    ).length;

    const drafts = quizzes.filter(
      (quiz) =>
        quiz.status === "Draft"
    ).length;

    return {
      total: quizzes.length,
      questions: totalQuestions,
      published,
      drafts,
    };
  }, [quizzes]);

  const openCreate = () => {
    setEditingQuiz(EMPTY_QUIZ());
    setEditorOpen(true);
  };

  const openEdit = (quiz) => {
    setEditingQuiz(normaliseQuiz(quiz));
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (saving) return;

    setEditorOpen(false);
    setEditingQuiz(null);
  };

  const saveQuiz = async (quiz) => {
    setSaving(true);

    try {
      if (isDemo) {
        const localQuiz = {
          ...normaliseQuiz(quiz),
          id:
            quiz.id ||
            `quiz-${Date.now()}`,
        };

        setQuizzes((previous) => {
          const exists = previous.some(
            (item) =>
              item.id === localQuiz.id
          );

          return exists
            ? previous.map((item) =>
                item.id === localQuiz.id
                  ? localQuiz
                  : item
              )
            : [...previous, localQuiz];
        });

        setMessage({
          severity: "success",
          text: quiz.id
            ? "Quiz updated successfully."
            : "Quiz created successfully.",
        });

        closeEditor();
        return;
      }

      const payload = {
        title: quiz.title.trim(),
        description:
          quiz.description.trim(),
        category: quiz.category.trim(),
        difficulty: quiz.difficulty,
        duration: Number(quiz.duration),
        passingScore: Number(
          quiz.passingScore
        ),
        attempts: Number(quiz.attempts),
        status:
          quiz.status || "Published",
        questions: quiz.questions.map(
          (question) => ({
            id: question.id,
            text: question.text.trim(),
            options: question.options.filter(
              (option) => option.trim()
            ),
            correctAnswer:
              question.correctAnswer,
            explanation:
              question.explanation?.trim() ||
              "",
          })
        ),
      };

      let response;

      if (quiz.id) {
        response = await axios.put(
          `${API_URL}/quizzes/${quiz.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/quizzes`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const savedQuiz = normaliseQuiz(
        response.data
      );

      setQuizzes((previous) => {
        const exists = previous.some(
          (item) =>
            item.id === savedQuiz.id
        );

        return exists
          ? previous.map((item) =>
              item.id === savedQuiz.id
                ? savedQuiz
                : item
            )
          : [...previous, savedQuiz];
      });

      setMessage({
        severity: "success",
        text: quiz.id
          ? "Quiz updated successfully."
          : "Quiz created successfully.",
      });

      closeEditor();
    } catch (error) {
      console.error(
        "Error saving quiz:",
        error
      );

      setMessage({
        severity: "error",
        text:
          error.response?.data?.message ||
          "Unable to save the quiz. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteQuiz) return;

    setDeleting(true);

    try {
      if (!isDemo) {
        await axios.delete(
          `${API_URL}/quizzes/${deleteQuiz.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setQuizzes((previous) =>
        previous.filter(
          (quiz) =>
            quiz.id !== deleteQuiz.id
        )
      );

      setMessage({
        severity: "success",
        text: "Quiz deleted successfully.",
      });

      setDeleteQuiz(null);
    } catch (error) {
      console.error(
        "Error deleting quiz:",
        error
      );

      setMessage({
        severity: "error",
        text:
          error.response?.data?.message ||
          "Unable to delete the quiz.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (quiz) => {
    const updated = {
      ...quiz,
      status:
        quiz.status === "Draft"
          ? "Published"
          : "Draft",
    };

    try {
      if (!isDemo) {
        await axios.put(
          `${API_URL}/quizzes/${quiz.id}`,
          updated,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setQuizzes((previous) =>
        previous.map((item) =>
          item.id === quiz.id
            ? updated
            : item
        )
      );

      setMessage({
        severity: "success",
        text:
          updated.status === "Published"
            ? "Quiz published."
            : "Quiz moved to draft.",
      });
    } catch (error) {
      console.error(
        "Error changing quiz status:",
        error
      );

      setMessage({
        severity: "error",
        text: "Unable to update quiz status.",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F7FA",
        pb: 7,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ pt: { xs: 3, md: 5 } }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              md: "flex-end",
            }}
            gap={2}
          >
            <Box>
              <Typography
                variant="caption"
                fontWeight={950}
                color="primary.main"
                letterSpacing={1.5}
              >
                QUIZ STUDIO
              </Typography>

              <Typography
                variant="h3"
                fontWeight={950}
                sx={{
                  mt: 0.5,
                  fontSize: {
                    xs: "2rem",
                    md: "3rem",
                  },
                  letterSpacing: "-1px",
                }}
              >
                Build quizzes learners enjoy.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 700,
                }}
              >
                Create meaningful knowledge checks, challenge your learners and turn every question into an opportunity to learn.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={openCreate}
              sx={{
                minHeight: 50,
                px: 2.5,
                borderRadius: 2.5,
                fontWeight: 950,
                boxShadow:
                  "0 10px 24px rgba(99,91,255,.22)",
              }}
            >
              Create quiz
            </Button>
          </Stack>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(4,1fr)",
            },
            gap: 1.5,
            mb: 4,
          }}
        >
          <QuizStatsCard
            icon={<QuizOutlined />}
            label="TOTAL QUIZZES"
            value={stats.total}
            caption="Across your classes"
          />

          <QuizStatsCard
            icon={<MenuBook />}
            label="QUESTIONS"
            value={stats.questions}
            caption="Questions created"
          />

          <QuizStatsCard
            icon={<TrendingUp />}
            label="PUBLISHED"
            value={stats.published}
            caption="Available to learners"
          />

          <QuizStatsCard
            icon={<HelpOutline />}
            label="DRAFTS"
            value={stats.drafts}
            caption="Still being prepared"
          />
        </Box>

        {/* Controls */}
        <Paper
          elevation={0}
          sx={{
            p: 1.25,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={1.25}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search quizzes..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      sx={{
                        color: "text.secondary",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <Select
              size="small"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value
                )
              }
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 190,
                },
                borderRadius: 2,
              }}
            >
              <MenuItem value="All">
                All difficulty levels
              </MenuItem>

              {DIFFICULTIES.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                )
              )}
            </Select>
          </Stack>
        </Paper>

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2,1fr)",
                xl: "repeat(3,1fr)",
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
                    height: 390,
                    borderRadius: 3,
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                    overflow: "hidden",
                  }}
                >
                  <LinearProgress />
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 55,
                        height: 55,
                        bgcolor: "#EEEEF4",
                        borderRadius: 2,
                      }}
                    />

                    <Box
                      sx={{
                        mt: 3,
                        height: 22,
                        width: "75%",
                        bgcolor: "#EEEEF4",
                        borderRadius: 1,
                      }}
                    />

                    <Box
                      sx={{
                        mt: 2,
                        height: 50,
                        bgcolor: "#F2F2F6",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
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
                py: 8,
                px: 3,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed",
                borderColor:
                  "rgba(99,91,255,.35)",
                bgcolor:
                  "rgba(99,91,255,.025)",
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  bgcolor:
                    "rgba(99,91,255,.1)",
                  color: "primary.main",
                }}
              >
                <QuizOutlined
                  sx={{ fontSize: 32 }}
                />
              </Avatar>

              <Typography
                variant="h6"
                fontWeight={950}
                sx={{ mt: 2 }}
              >
                No quizzes found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                {search
                  ? "Try another search term."
                  : "Create your first quiz and start checking what your learners understand."}
              </Typography>

              {!search && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={openCreate}
                  sx={{
                    mt: 2.5,
                    borderRadius: 2,
                    fontWeight: 900,
                  }}
                >
                  Create your first quiz
                </Button>
              )}
            </Paper>
          )}

        {/* Quiz grid */}
        {!loading &&
          filteredQuizzes.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2,1fr)",
                  xl: "repeat(3,1fr)",
                },
                gap: 2.5,
              }}
            >
              {filteredQuizzes.map(
                (quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onEdit={() =>
                      openEdit(quiz)
                    }
                    onPreview={() =>
                      setPreviewQuiz(quiz)
                    }
                    onDelete={() =>
                      setDeleteQuiz(quiz)
                    }
                    onToggleStatus={() =>
                      toggleStatus(quiz)
                    }
                  />
                )
              )}
            </Box>
          )}
      </Container>

      {/* Editor */}
      <QuizEditor
        open={editorOpen}
        quiz={editingQuiz}
        saving={saving}
        onClose={closeEditor}
        onSave={saveQuiz}
      />

      {/* Preview */}
      <PreviewDialog
        open={Boolean(previewQuiz)}
        quiz={previewQuiz}
        onClose={() =>
          setPreviewQuiz(null)
        }
      />

      {/* Delete */}
      <DeleteDialog
        open={Boolean(deleteQuiz)}
        quiz={deleteQuiz}
        deleting={deleting}
        onClose={() =>
          !deleting && setDeleteQuiz(null)
        }
        onConfirm={confirmDelete}
      />

      {/* Notification */}
      {message && (
        <Box
          sx={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 1500,
            maxWidth: 420,
          }}
        >
          <Alert
            severity={message.severity}
            onClose={() =>
              setMessage(null)
            }
            variant="filled"
            sx={{
              borderRadius: 2.5,
              boxShadow:
                "0 14px 40px rgba(0,0,0,.18)",
            }}
          >
            {message.text}
          </Alert>
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() =>
          setMenuAnchor(null)
        }
      >
        <MenuItem
          onClick={() =>
            setMenuAnchor(null)
          }
        >
          <Preview sx={{ mr: 1 }} />
          Preview
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Quizzes;