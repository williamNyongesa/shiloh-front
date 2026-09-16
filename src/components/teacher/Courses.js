import React, { useMemo, useRef, useState } from 'react';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  Add,
  ArrowBack,
  ArrowForward,
  AutoStories,
  CheckCircle,
  Close,
  CloudUpload,
  Delete,
  Description,
  Edit,
  ExpandMore,
  FileUpload,
  Group,
  Image,
  LibraryAdd,
  MoreHoriz,
  OndemandVideo,
  PlayArrow,
  Publish,
  Search,
  School,
  Settings,
  VideoLibrary,
  Visibility,
} from '@mui/icons-material';

import { useDropzone } from 'react-dropzone';

import { getDemoUser } from '../../demoData';

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const STEPS = [
  'Course details',
  'Course structure',
  'Learning materials',
  'Review & publish',
];

const ACCEPTED_DOCUMENTS = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
};

const ACCEPTED_VIDEOS = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const createEmptyLesson = () => ({
  id: `lesson-${Date.now()}-${Math.random()}`,
  title: '',
  description: '',
  type: 'lesson',
  duration: '',
  files: [],
});

const createEmptyModule = () => ({
  id: `module-${Date.now()}-${Math.random()}`,
  title: '',
  description: '',
  lessons: [createEmptyLesson()],
});

const createEmptyCourse = () => ({
  id: null,
  name: '',
  description: '',
  level: 'Beginner',
  category: '',
  thumbnail: '',
  modules: [createEmptyModule()],
  published: false,
});

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

const Courses = () => {
  const teacherData = useMemo(() => getDemoUser('teacher'), []);

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Foundations of Computer Science',
      description:
        'Learn the fundamental concepts behind modern computer science.',
      level: 'Intermediate',
      category: 'Computer Science',
      students: 24,
      progress: 68,
      next: 'Algorithms and flow',
      published: true,
      modules: [],
    },
    {
      id: 2,
      name: 'Creative Problem Solving',
      description:
        'Develop practical techniques for solving complex problems.',
      level: 'Beginner',
      category: 'Personal Development',
      students: 18,
      progress: 51,
      next: 'Framing better questions',
      published: true,
      modules: [],
    },
    {
      id: 3,
      name: 'Communication for Leaders',
      description:
        'Build confident communication and presentation skills.',
      level: 'Advanced',
      category: 'Leadership',
      students: 16,
      progress: 84,
      next: 'Final presentations',
      published: false,
      modules: [],
    },
  ]);

  const [filter, setFilter] = useState('All courses');
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [courseEditorOpen, setCourseEditorOpen] = useState(false);
  const [coursePreviewOpen, setCoursePreviewOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [activeModule, setActiveModule] = useState(0);

  const [saving, setSaving] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuCourse, setMenuCourse] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  /* ---------------------------------------------------------------------- */
  /* Filtering                                                              */
  /* ---------------------------------------------------------------------- */

  const visibleCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesFilter =
        filter === 'All courses' || course.level === filter;

      const matchesSearch =
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.category?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, search]);

  /* ---------------------------------------------------------------------- */
  /* Snackbar                                                               */
  /* ---------------------------------------------------------------------- */

  const showMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Course creation                                                        */
  /* ---------------------------------------------------------------------- */

  const handleCreateCourse = () => {
    setEditingCourse(createEmptyCourse());
    setActiveStep(0);
    setActiveModule(0);
    setCreateOpen(true);
  };

  const handleContinueCreate = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackCreate = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleCloseEditor = () => {
    if (saving) return;

    setCreateOpen(false);
    setCourseEditorOpen(false);
    setEditingCourse(null);
    setActiveStep(0);
    setActiveModule(0);
  };

  /* ---------------------------------------------------------------------- */
  /* Course editing                                                         */
  /* ---------------------------------------------------------------------- */

  const handleEditCourse = (course) => {
    setEditingCourse({
      ...course,
      modules:
        course.modules?.length > 0
          ? course.modules
          : [createEmptyModule()],
    });

    setActiveStep(0);
    setActiveModule(0);
    setCreateOpen(true);
  };

  /* ---------------------------------------------------------------------- */
  /* Course details                                                         */
  /* ---------------------------------------------------------------------- */

  const updateCourse = (field, value) => {
    setEditingCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---------------------------------------------------------------------- */
  /* Modules                                                                 */
  /* ---------------------------------------------------------------------- */

  const addModule = () => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, createEmptyModule()],
    }));

    setActiveModule(editingCourse.modules.length);
  };

  const updateModule = (moduleIndex, field, value) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              [field]: value,
            }
          : module
      ),
    }));
  };

  const deleteModule = (moduleIndex) => {
    if (editingCourse.modules.length === 1) {
      showMessage('A course must contain at least one module.', 'warning');
      return;
    }

    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, index) => index !== moduleIndex),
    }));

    setActiveModule(Math.max(0, moduleIndex - 1));
  };

  /* ---------------------------------------------------------------------- */
  /* Lessons                                                                 */
  /* ---------------------------------------------------------------------- */

  const addLesson = (moduleIndex) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: [...module.lessons, createEmptyLesson()],
            }
          : module
      ),
    }));
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lessonIndexValue) =>
                lessonIndexValue === lessonIndex
                  ? {
                      ...lesson,
                      [field]: value,
                    }
                  : lesson
              ),
            }
          : module
      ),
    }));
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.filter(
                (_, lessonIndexValue) => lessonIndexValue !== lessonIndex
              ),
            }
          : module
      ),
    }));
  };

  /* ---------------------------------------------------------------------- */
  /* File handling                                                           */
  /* ---------------------------------------------------------------------- */

  const addFilesToLesson = (moduleIndex, lessonIndex, files) => {
    const preparedFiles = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      preview: file.type.startsWith('video/')
        ? URL.createObjectURL(file)
        : null,
    }));

    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module, moduleIndexValue) =>
        moduleIndexValue === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map(
                (lesson, lessonIndexValue) =>
                  lessonIndexValue === lessonIndex
                    ? {
                        ...lesson,
                        files: [...lesson.files, ...preparedFiles],
                      }
                    : lesson
              ),
            }
          : module
      ),
    }));
  };

  const removeLessonFile = (moduleIndex, lessonIndex, fileId) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module, moduleIndexValue) =>
        moduleIndexValue === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map(
                (lesson, lessonIndexValue) =>
                  lessonIndexValue === lessonIndex
                    ? {
                        ...lesson,
                        files: lesson.files.filter(
                          (file) => file.id !== fileId
                        ),
                      }
                    : lesson
              ),
            }
          : module
      ),
    }));
  };

  /* ---------------------------------------------------------------------- */
  /* Save course                                                             */
  /* ---------------------------------------------------------------------- */

  const handleSaveCourse = async (publish = false) => {
    if (!editingCourse.name.trim()) {
      setActiveStep(0);
      showMessage('Please enter a course title.', 'error');
      return;
    }

    setSaving(true);

    try {
      const courseToSave = {
        ...editingCourse,
        published: publish,
      };

      /*
       * ---------------------------------------------------------------
       * BACKEND INTEGRATION
       * ---------------------------------------------------------------
       *
       * Replace this section with your API request.
       *
       * Example:
       *
       * const formData = new FormData();
       *
       * formData.append('name', courseToSave.name);
       * formData.append('description', courseToSave.description);
       * formData.append('level', courseToSave.level);
       *
       * await axios.post('/api/courses', formData, {
       *   headers: {
       *      Authorization: `Bearer ${token}`,
       *   },
       * });
       *
       * ---------------------------------------------------------------
       */

      await new Promise((resolve) => setTimeout(resolve, 700));

      if (editingCourse.id) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === editingCourse.id
              ? {
                  ...courseToSave,
                  students: course.students || 0,
                  progress: course.progress || 0,
                  next: course.next || 'Continue learning',
                }
              : course
          )
        );

        showMessage(
          publish
            ? 'Course updated and published.'
            : 'Course updated successfully.'
        );
      } else {
        const newCourse = {
          ...courseToSave,
          id: Date.now(),
          students: 0,
          progress: 0,
          next: 'Add your first lesson',
        };

        setCourses((prev) => [...prev, newCourse]);

        showMessage(
          publish
            ? 'Course created and published.'
            : 'Course saved as a draft.'
        );
      }

      handleCloseEditor();
    } catch (error) {
      console.error(error);
      showMessage('Unable to save the course. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Open course                                                             */
  /* ---------------------------------------------------------------------- */

  const handleOpenCourse = (course) => {
    setSelectedCourse(course);
    setCoursePreviewOpen(true);
  };

  /* ---------------------------------------------------------------------- */
  /* Delete course                                                           */
  /* ---------------------------------------------------------------------- */

  const handleDeleteCourse = (course) => {
    const confirmed = window.confirm(
      `Delete "${course.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setCourses((prev) =>
      prev.filter((currentCourse) => currentCourse.id !== course.id)
    );

    showMessage('Course deleted successfully.');
  };

  /* ---------------------------------------------------------------------- */
  /* Course menu                                                             */
  /* ---------------------------------------------------------------------- */

  const openCourseMenu = (event, course) => {
    setMenuAnchor(event.currentTarget);
    setMenuCourse(course);
  };

  const closeCourseMenu = () => {
    setMenuAnchor(null);
    setMenuCourse(null);
  };

  const handleMenuEdit = () => {
    if (!menuCourse) return;

    const course = menuCourse;

    closeCourseMenu();
    handleEditCourse(course);
  };

  const handleMenuDelete = () => {
    if (!menuCourse) return;

    const course = menuCourse;

    closeCourseMenu();
    handleDeleteCourse(course);
  };

  const handleMenuPreview = () => {
    if (!menuCourse) return;

    const course = menuCourse;

    closeCourseMenu();
    handleOpenCourse(course);
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 3,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            TEACHING SPACE
          </Typography>

          <Typography
            variant="h3"
            sx={{
              mt: 0.5,
              fontWeight: 900,
              letterSpacing: '-0.04em',
            }}
          >
            Your courses
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              maxWidth: 680,
              fontSize: '1.05rem',
            }}
          >
            Create engaging learning experiences, organize your lessons,
            upload resources and keep your learners moving forward.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          endIcon={<ArrowForward />}
          onClick={handleCreateCourse}
          sx={{
            minHeight: 52,
            px: 3,
            borderRadius: 3,
            fontWeight: 800,
          }}
        >
          Create course
        </Button>
      </Box>

      {/* ---------------------------------------------------------------- */}
      {/* Stats                                                             */}
      {/* ---------------------------------------------------------------- */}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AutoStories />}
            title="Total courses"
            value={courses.length}
            description="Courses created"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Group />}
            title="Active learners"
            value={courses.reduce(
              (total, course) => total + (course.students || 0),
              0
            )}
            description="Across your courses"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<VideoLibrary />}
            title="Published"
            value={courses.filter((course) => course.published).length}
            description="Live courses"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingIcon />}
            title="Avg. progress"
            value={`${Math.round(
              courses.reduce(
                (total, course) => total + (course.progress || 0),
                0
              ) / Math.max(courses.length, 1)
            )}%`}
            description="Learner progress"
          />
        </Grid>
      </Grid>

      {/* ---------------------------------------------------------------- */}
      {/* Search + filters                                                  */}
      {/* ---------------------------------------------------------------- */}

      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search courses..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search courses"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: 'auto',
              pb: { xs: 0.5, md: 0 },
            }}
          >
            {['All courses', ...COURSE_LEVELS].map((level) => (
              <Chip
                key={level}
                label={level}
                clickable
                color={filter === level ? 'primary' : 'default'}
                variant={filter === level ? 'filled' : 'outlined'}
                onClick={() => setFilter(level)}
                sx={{
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* ---------------------------------------------------------------- */}
      {/* Course grid                                                       */}
      {/* ---------------------------------------------------------------- */}

      {visibleCourses.length === 0 ? (
        <EmptyCoursesState onCreate={handleCreateCourse} />
      ) : (
        <Grid container spacing={3}>
          {visibleCourses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course.id}>
              <CourseCard
                course={course}
                onOpen={() => handleOpenCourse(course)}
                onEdit={() => handleEditCourse(course)}
                onMenu={(event) => openCourseMenu(event, course)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Teacher insight                                                   */}
      {/* ---------------------------------------------------------------- */}

      <Paper
        elevation={0}
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
          }}
        >
          <School />
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={900}>
            Your learners are gaining momentum
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {teacherData?.teacher?.students?.length || 0} learners are active
            across your current courses. Keep adding engaging lessons,
            exercises and learning resources.
          </Typography>
        </Box>

        <Button
          endIcon={<ArrowForward />}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          Review work
        </Button>
      </Paper>

      {/* ---------------------------------------------------------------- */}
      {/* Course menu                                                       */}
      {/* ---------------------------------------------------------------- */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeCourseMenu}
      >
        <MenuItem onClick={handleMenuPreview}>
          <Visibility sx={{ mr: 1.5 }} />
          Preview
        </MenuItem>

        <MenuItem onClick={handleMenuEdit}>
          <Edit sx={{ mr: 1.5 }} />
          Edit course
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleMenuDelete}
          sx={{
            color: 'error.main',
          }}
        >
          <Delete sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* ---------------------------------------------------------------- */}
      {/* Course builder                                                    */}
      {/* ---------------------------------------------------------------- */}

      <CourseBuilderDialog
        open={createOpen}
        course={editingCourse}
        activeStep={activeStep}
        activeModule={activeModule}
        saving={saving}
        onClose={handleCloseEditor}
        onStepChange={setActiveStep}
        onModuleChange={setActiveModule}
        onUpdateCourse={updateCourse}
        onUpdateModule={updateModule}
        onAddModule={addModule}
        onDeleteModule={deleteModule}
        onAddLesson={addLesson}
        onUpdateLesson={updateLesson}
        onDeleteLesson={deleteLesson}
        onAddFiles={addFilesToLesson}
        onRemoveFile={removeLessonFile}
        onBack={handleBackCreate}
        onNext={handleContinueCreate}
        onSave={() => handleSaveCourse(false)}
        onPublish={() => handleSaveCourse(true)}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Course preview                                                    */}
      {/* ---------------------------------------------------------------- */}

      <CoursePreviewDialog
        open={coursePreviewOpen}
        course={selectedCourse}
        onClose={() => {
          setCoursePreviewOpen(false);
          setSelectedCourse(null);
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Snackbar                                                          */}
      {/* ---------------------------------------------------------------- */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
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
    </Container>
  );
};

/* ========================================================================== */
/* Course Card                                                                */
/* ========================================================================== */

const CourseCard = ({ course, onOpen, onEdit, onMenu }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all .2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Box
        sx={{
          minHeight: 150,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, rgba(25,118,210,.15), rgba(156,39,176,.15))',
        }}
      >
        <AutoStories
          sx={{
            fontSize: 54,
            opacity: 0.8,
          }}
        />

        <Chip
          label={course.published ? 'Published' : 'Draft'}
          size="small"
          color={course.published ? 'success' : 'default'}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            fontWeight: 800,
          }}
        />

        <IconButton
          aria-label={`More options for ${course.name}`}
          onClick={onMenu}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <MoreHoriz />
        </IconButton>
      </Box>

      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={course.level} size="small" />
          {course.category && (
            <Chip label={course.category} size="small" variant="outlined" />
          )}
        </Stack>

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            lineHeight: 1.25,
          }}
        >
          {course.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            minHeight: 42,
          }}
        >
          {course.description || `Next: ${course.next}`}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Learners
            </Typography>

            <Typography fontWeight={900}>
              {course.students}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>

            <Typography fontWeight={900}>
              {course.progress}%
            </Typography>
          </Box>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={course.progress}
          sx={{
            mt: 1.5,
            height: 7,
            borderRadius: 10,
          }}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={onOpen}
          >
            Preview
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<Edit />}
            onClick={onEdit}
          >
            Edit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* ========================================================================== */
/* Course Builder Dialog                                                       */
/* ========================================================================== */

const CourseBuilderDialog = ({
  open,
  course,
  activeStep,
  activeModule,
  saving,
  onClose,
  onStepChange,
  onModuleChange,
  onUpdateCourse,
  onUpdateModule,
  onAddModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onAddFiles,
  onRemoveFile,
  onBack,
  onNext,
  onSave,
  onPublish,
}) => {
  if (!course) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={false}
      PaperProps={{
        sx: {
          minHeight: {
            md: '85vh',
          },
          borderRadius: {
            xs: 0,
            md: 4,
          },
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
            pt: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={900}>
              {course.id ? 'Edit course' : 'Create a course'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Build a structured and engaging learning experience.
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            disabled={saving}
            aria-label="Close course builder"
          >
            <Close />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ px: 3, pt: 2 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {STEPS.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Tabs
            value={activeStep}
            onChange={(_, value) => onStepChange(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              display: { xs: 'flex', md: 'none' },
            }}
          >
            {STEPS.map((step) => (
              <Tab key={step} label={step} />
            ))}
          </Tabs>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        {activeStep === 0 && (
          <CourseDetailsStep
            course={course}
            onUpdate={onUpdateCourse}
          />
        )}

        {activeStep === 1 && (
          <CourseStructureStep
            course={course}
            activeModule={activeModule}
            onModuleChange={onModuleChange}
            onUpdateModule={onUpdateModule}
            onAddModule={onAddModule}
            onDeleteModule={onDeleteModule}
            onAddLesson={onAddLesson}
            onUpdateLesson={onUpdateLesson}
            onDeleteLesson={onDeleteLesson}
          />
        )}

        {activeStep === 2 && (
          <LearningMaterialsStep
            course={course}
            activeModule={activeModule}
            onAddFiles={onAddFiles}
            onRemoveFile={onRemoveFile}
          />
        )}

        {activeStep === 3 && (
          <ReviewCourseStep course={course} />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={onBack}
          disabled={activeStep === 0 || saving}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={20} />
            ) : (
              'Save draft'
            )}
          </Button>

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={onNext}
              endIcon={<ArrowForward />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={onPublish}
              startIcon={<Publish />}
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish course'}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

/* ========================================================================== */
/* Step 1: Course Details                                                     */
/* ========================================================================== */

const CourseDetailsStep = ({ course, onUpdate }) => {
  return (
    <Box>
      <SectionHeader
        icon={<Settings />}
        title="Course details"
        description="Give your course a clear identity so learners know what they are about to learn."
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            required
            label="Course title"
            placeholder="e.g. Introduction to Web Development"
            value={course.name}
            onChange={(event) =>
              onUpdate('name', event.target.value)
            }
            helperText="Use a clear title that immediately communicates the subject."
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Difficulty level</InputLabel>

            <Select
              label="Difficulty level"
              value={course.level}
              onChange={(event) =>
                onUpdate('level', event.target.value)
              }
            >
              {COURSE_LEVELS.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>

            <FormHelperText>
              Helps learners choose the right course.
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Category"
            placeholder="Computer Science"
            value={course.category}
            onChange={(event) =>
              onUpdate('category', event.target.value)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Course description"
            placeholder="Explain what learners will learn, who the course is for and what they should expect."
            value={course.description}
            onChange={(event) =>
              onUpdate('description', event.target.value)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>
                <Image />
              </Avatar>

              <Box>
                <Typography fontWeight={800}>
                  Course thumbnail
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Add a visual identity for the course.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<FileUpload />}
                sx={{ ml: 'auto' }}
              >
                Upload image
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

/* ========================================================================== */
/* Step 2: Course Structure                                                   */
/* ========================================================================== */

const CourseStructureStep = ({
  course,
  activeModule,
  onModuleChange,
  onUpdateModule,
  onAddModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
}) => {
  const currentModule = course.modules[activeModule];

  return (
    <Box>
      <SectionHeader
        icon={<LibraryAdd />}
        title="Course structure"
        description="Break the course into modules and lessons. A clear structure makes learning easier."
      />

      <Grid container spacing={3}>
        {/* Modules sidebar */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography fontWeight={900}>
                Modules
              </Typography>
            </Box>

            <Divider />

            <Stack>
              {course.modules.map((module, index) => (
                <Button
                  key={module.id}
                  onClick={() => onModuleChange(index)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    borderRadius: 0,
                    px: 2,
                    py: 1.5,
                    fontWeight: activeModule === index ? 900 : 500,
                    backgroundColor:
                      activeModule === index
                        ? 'action.selected'
                        : 'transparent',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      mr: 1.5,
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                    >
                      {module.title || `Module ${index + 1}`}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {module.lessons.length} lessons
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Stack>

            <Divider />

            <Button
              fullWidth
              startIcon={<Add />}
              onClick={onAddModule}
              sx={{
                py: 1.5,
              }}
            >
              Add module
            </Button>
          </Paper>
        </Grid>

        {/* Module editor */}
        <Grid item xs={12} md={9}>
          {currentModule && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="overline"
                    fontWeight={800}
                  >
                    MODULE {activeModule + 1}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Structure your module
                  </Typography>
                </Box>

                <Tooltip title="Delete module">
                  <IconButton
                    color="error"
                    onClick={() => onDeleteModule(activeModule)}
                    aria-label="Delete module"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Module title"
                  placeholder="e.g. HTML Fundamentals"
                  value={currentModule.title}
                  onChange={(event) =>
                    onUpdateModule(
                      activeModule,
                      'title',
                      event.target.value
                    )
                  }
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Module description"
                  placeholder="What will learners accomplish in this module?"
                  value={currentModule.description}
                  onChange={(event) =>
                    onUpdateModule(
                      activeModule,
                      'description',
                      event.target.value
                    )
                  }
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight={900}>
                      Lessons
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Add videos, explanations, documents and activities.
                    </Typography>
                  </Box>

                  <Button
                    startIcon={<Add />}
                    onClick={() =>
                      onAddLesson(activeModule)
                    }
                  >
                    Add lesson
                  </Button>
                </Stack>

                {currentModule.lessons.map(
                  (lesson, lessonIndex) => (
                    <LessonEditor
                      key={lesson.id}
                      lesson={lesson}
                      index={lessonIndex}
                      onUpdate={(field, value) =>
                        onUpdateLesson(
                          activeModule,
                          lessonIndex,
                          field,
                          value
                        )
                      }
                      onDelete={() =>
                        onDeleteLesson(
                          activeModule,
                          lessonIndex
                        )
                      }
                    />
                  )
                )}
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

/* ========================================================================== */
/* Lesson Editor                                                              */
/* ========================================================================== */

const LessonEditor = ({
  lesson,
  index,
  onUpdate,
  onDelete,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
          }}
        >
          {index + 1}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Lesson title"
            placeholder="e.g. What is HTML?"
            value={lesson.title}
            onChange={(event) =>
              onUpdate('title', event.target.value)
            }
          />

          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            label="Lesson description"
            sx={{ mt: 2 }}
            value={lesson.description}
            onChange={(event) =>
              onUpdate('description', event.target.value)
            }
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Lesson type</InputLabel>

              <Select
                label="Lesson type"
                value={lesson.type}
                onChange={(event) =>
                  onUpdate('type', event.target.value)
                }
              >
                <MenuItem value="lesson">
                  Lesson
                </MenuItem>

                <MenuItem value="video">
                  Video
                </MenuItem>

                <MenuItem value="assignment">
                  Assignment
                </MenuItem>

                <MenuItem value="quiz">
                  Quiz
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Duration"
              placeholder="15 min"
              value={lesson.duration}
              onChange={(event) =>
                onUpdate('duration', event.target.value)
              }
            />
          </Stack>
        </Box>

        <IconButton
          color="error"
          onClick={onDelete}
          aria-label={`Delete lesson ${index + 1}`}
        >
          <Delete />
        </IconButton>
      </Stack>
    </Paper>
  );
};

/* ========================================================================== */
/* Step 3: Learning Materials                                                 */
/* ========================================================================== */

const LearningMaterialsStep = ({
  course,
  activeModule,
  onAddFiles,
  onRemoveFile,
}) => {
  const fileInputRef = useRef(null);

  const [selectedLesson, setSelectedLesson] = useState(0);
  const [uploadType, setUploadType] = useState('all');

  const module = course.modules[activeModule];

  if (!module) {
    return null;
  }

  const lesson = module.lessons[selectedLesson];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 0) {
      onAddFiles(activeModule, selectedLesson, files);
    }

    event.target.value = '';
  };

  return (
    <Box>
      <SectionHeader
        icon={<CloudUpload />}
        title="Learning materials"
        description="Upload documents and videos directly into the lesson where learners will use them."
      />

      <Grid container spacing={3}>
        {/* Lesson list */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography fontWeight={900}>
                {module.title || 'Current module'}
              </Typography>
            </Box>

            <Divider />

            {module.lessons.map((currentLesson, index) => (
              <Button
                key={currentLesson.id}
                fullWidth
                onClick={() => setSelectedLesson(index)}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderRadius: 0,
                  px: 2,
                  py: 1.5,
                  backgroundColor:
                    selectedLesson === index
                      ? 'action.selected'
                      : 'transparent',
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    mr: 1.5,
                  }}
                >
                  {index + 1}
                </Avatar>

                <Typography
                  variant="body2"
                  noWrap
                >
                  {currentLesson.title ||
                    `Lesson ${index + 1}`}
                </Typography>
              </Button>
            ))}
          </Paper>
        </Grid>

        {/* Upload area */}
        <Grid item xs={12} md={9}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  {lesson?.title || 'Select a lesson'}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Upload resources for this lesson.
                </Typography>
              </Box>

              <FormControl size="small">
                <InputLabel>File type</InputLabel>

                <Select
                  label="File type"
                  value={uploadType}
                  onChange={(event) =>
                    setUploadType(event.target.value)
                  }
                >
                  <MenuItem value="all">
                    All files
                  </MenuItem>

                  <MenuItem value="documents">
                    Documents
                  </MenuItem>

                  <MenuItem value="videos">
                    Videos
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box
              sx={{
                mt: 3,
                p: 4,
                minHeight: 240,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'all .2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onDragOver={(event) =>
                event.preventDefault()
              }
              onDrop={(event) => {
                event.preventDefault();

                const files = Array.from(
                  event.dataTransfer.files
                );

                if (files.length > 0) {
                  onAddFiles(
                    activeModule,
                    selectedLesson,
                    files
                  );
                }
              }}
            >
              <Box>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <CloudUpload />
                </Avatar>

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Drop learning materials here
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Upload PDFs, Word documents, presentations or
                  teaching videos.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<FileUpload />}
                  sx={{
                    mt: 3,
                  }}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Choose files
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept={[
                    ...Object.values(ACCEPTED_DOCUMENTS)
                      .flat()
                      .join(','),
                    ...Object.values(ACCEPTED_VIDEOS)
                      .flat()
                      .join(','),
                  ].join(',')}
                  onChange={handleFileSelect}
                />

                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Supported: PDF, DOC, DOCX, PPT, PPTX, MP4,
                  WebM and MOV
                </Typography>
              </Box>
            </Box>

            {/* Uploaded files */}
            <Box sx={{ mt: 4 }}>
              <Typography fontWeight={900} sx={{ mb: 2 }}>
                Uploaded resources
              </Typography>

              {lesson?.files?.length === 0 ? (
                <Alert severity="info">
                  No resources have been uploaded to this
                  lesson yet.
                </Alert>
              ) : (
                <Stack spacing={1.5}>
                  {lesson.files.map((file) => (
                    <UploadedFile
                      key={file.id}
                      file={file}
                      onRemove={() =>
                        onRemoveFile(
                          activeModule,
                          selectedLesson,
                          file.id
                        )
                      }
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

/* ========================================================================== */
/* Uploaded File                                                              */
/* ========================================================================== */

const UploadedFile = ({ file, onRemove }) => {
  const isVideo = file.type?.startsWith('video/');
  const isPdf = file.type === 'application/pdf';

  const sizeInMb = (file.size / 1024 / 1024).toFixed(2);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Avatar>
          {isVideo ? (
            <OndemandVideo />
          ) : isPdf ? (
            <Description />
          ) : (
            <Description />
          )}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            fontWeight={700}
            noWrap
          >
            {file.name}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {sizeInMb} MB
          </Typography>
        </Box>

        {isVideo && file.preview && (
          <Chip
            icon={<PlayArrow />}
            label="Video"
            size="small"
          />
        )}

        <Tooltip title="Remove file">
          <IconButton
            color="error"
            onClick={onRemove}
            aria-label={`Remove ${file.name}`}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

/* ========================================================================== */
/* Step 4: Review                                                             */
/* ========================================================================== */

const ReviewCourseStep = ({ course }) => {
  const moduleCount = course.modules.length;

  const lessonCount = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const resourceCount = course.modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (lessonTotal, lesson) =>
          lessonTotal + lesson.files.length,
        0
      ),
    0
  );

  return (
    <Box>
      <SectionHeader
        icon={<CheckCircle />}
        title="Review your course"
        description="Make sure everything looks good before publishing."
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Chip
              label={course.level}
              color="primary"
              size="small"
            />

            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ mt: 1 }}
            >
              {course.name || 'Untitled course'}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: 700,
              }}
            >
              {course.description ||
                'No course description has been added yet.'}
            </Typography>
          </Box>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ReviewStat
                icon={<LibraryAdd />}
                value={moduleCount}
                label="Modules"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <ReviewStat
                icon={<AutoStories />}
                value={lessonCount}
                label="Lessons"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <ReviewStat
                icon={<Description />}
                value={resourceCount}
                label="Resources"
              />
            </Grid>
          </Grid>

          <Divider />

          <Box>
            <Typography fontWeight={900} sx={{ mb: 2 }}>
              Course structure
            </Typography>

            <Stack spacing={1.5}>
              {course.modules.map((module, moduleIndex) => (
                <Paper
                  key={module.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={800}>
                    {moduleIndex + 1}.{' '}
                    {module.title ||
                      `Module ${moduleIndex + 1}`}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {module.lessons.length} lessons
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

/* ========================================================================== */
/* Course Preview                                                             */
/* ========================================================================== */

const CoursePreviewDialog = ({
  open,
  course,
  onClose,
}) => {
  if (!course) return null;

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
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5" fontWeight={900}>
              Course preview
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              This is how your learners will see the course.
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            aria-label="Close course preview"
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            background:
              'linear-gradient(135deg, rgba(25,118,210,.12), rgba(156,39,176,.12))',
          }}
        >
          <Chip label={course.level} />

          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              mt: 2,
              letterSpacing: '-0.04em',
            }}
          >
            {course.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: 700,
            }}
          >
            {course.description}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 3,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              icon={<LibraryAdd />}
              label={`${course.modules?.length || 0} modules`}
            />

            <Chip
              icon={<Group />}
              label={`${course.students || 0} learners`}
            />
          </Stack>
        </Box>

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{ mt: 4, mb: 2 }}
        >
          Course content
        </Typography>

        {course.modules?.length ? (
          <Stack spacing={2}>
            {course.modules.map((module, index) => (
              <Paper
                key={module.id}
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                }}
              >
                <Typography fontWeight={900}>
                  Module {index + 1}: {module.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {module.lessons.length} lessons
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Alert severity="info">
            This course does not have modules yet.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close preview</Button>

        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={onClose}
        >
          Start preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ========================================================================== */
/* Reusable UI Components                                                     */
/* ========================================================================== */

const SectionHeader = ({
  icon,
  title,
  description,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Avatar>{icon}</Avatar>

        <Box>
          <Typography
            variant="h5"
            fontWeight={900}
          >
            {title}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Stack direction="row" spacing={2}>
        <Avatar>{icon}</Avatar>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            fontWeight={900}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const ReviewStat = ({
  icon,
  value,
  label,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        textAlign: 'center',
      }}
    >
      <Avatar sx={{ mx: 'auto', mb: 1 }}>
        {icon}
      </Avatar>

      <Typography
        variant="h5"
        fontWeight={900}
      >
        {value}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {label}
      </Typography>
    </Paper>
  );
};

const EmptyCoursesState = ({ onCreate }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 4,
      }}
    >
      <Avatar
        sx={{
          width: 72,
          height: 72,
          mx: 'auto',
          mb: 2,
        }}
      >
        <AutoStories fontSize="large" />
      </Avatar>

      <Typography
        variant="h5"
        fontWeight={900}
      >
        No courses found
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 1,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        Create your first course and start building an engaging
        learning experience for your students.
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreate}
        sx={{ mt: 3 }}
      >
        Create your first course
      </Button>
    </Paper>
  );
};

/* ========================================================================== */
/* Small icon component                                                       */
/* ========================================================================== */

const TrendingIcon = () => {
  return <AutoStories />;
};

export default Courses;