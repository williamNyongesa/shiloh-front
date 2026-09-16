import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import {
  Accessibility,
  Contrast,
  DarkMode,
  Email,
  FormatSize,
  Language,
  MotionPhotosOff,
  Notifications,
  Visibility,
  ZoomIn,
} from '@mui/icons-material';

import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .test(
      'optional-password',
      'Password must be at least 6 characters',
      (value) => !value || value.length >= 6
    ),
});

const defaultAccessibility = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  dyslexiaFont: false,
  largeCursor: false,
  colorBlindMode: false,
  focusIndicators: true,
};

const TeacherSettingsPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  }, []);

  const token = localStorage.getItem('access_token');

  const [userDetails, setUserDetails] = useState({
    name: user.username || '',
    email: user.email || '',
    profilePicture: 'default.jpg',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    language: 'English',
  });

  const [accessibility, setAccessibility] = useState(() => {
    try {
      const saved = localStorage.getItem('accessibilitySettings');

      return saved
        ? {
            ...defaultAccessibility,
            ...JSON.parse(saved),
          }
        : defaultAccessibility;
    } catch {
      return defaultAccessibility;
    }
  });

  /*
   * Apply accessibility settings globally.
   */
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      '--app-font-size',
      `${accessibility.fontSize}%`
    );

    root.classList.toggle(
      'high-contrast-mode',
      accessibility.highContrast
    );

    root.classList.toggle(
      'reduced-motion-mode',
      accessibility.reducedMotion
    );

    root.classList.toggle(
      'dyslexia-font-mode',
      accessibility.dyslexiaFont
    );

    root.classList.toggle(
      'large-cursor-mode',
      accessibility.largeCursor
    );

    root.classList.toggle(
      'color-blind-mode',
      accessibility.colorBlindMode
    );

    root.classList.toggle(
      'enhanced-focus-mode',
      accessibility.focusIndicators
    );

    localStorage.setItem(
      'accessibilitySettings',
      JSON.stringify(accessibility)
    );
  }, [accessibility]);

  const updateAccessibility = (key, value) => {
    setAccessibility((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetAccessibility = () => {
    setAccessibility(defaultAccessibility);
  };

  /*
   * Profile image upload
   */
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setUserDetails((previous) => ({
        ...previous,
        profilePicture: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  /*
   * Update account
   */
  const handleSubmit = async (values) => {
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();

    if (values.email) {
      formData.append('email', values.email);
    }

    if (values.password) {
      formData.append('password', values.password);
    }

    if (userDetails.profilePicture !== 'default.jpg') {
      formData.append(
        'profilePicture',
        userDetails.profilePicture
      );
    }

    try {
      await axios.put(
        'http://localhost:5000/users',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(
        'Your account information has been updated successfully.'
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          'Unable to update your account. Please try again.'
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>

        {/* PAGE HEADER */}
        <Box>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={800}
            gutterBottom
          >
            Settings
          </Typography>

          <Typography color="text.secondary">
            Manage your account, teaching preferences,
            notifications, and accessibility options.
          </Typography>
        </Box>

        {successMessage && (
          <Alert
            severity="success"
            role="status"
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert
            severity="error"
            role="alert"
            onClose={() => setErrorMessage('')}
          >
            {errorMessage}
          </Alert>
        )}

        {/* ACCOUNT SETTINGS */}
        <Paper
          component="section"
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            gutterBottom
          >
            Account
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Update your account information.
          </Typography>

          <Formik
            initialValues={{
              email: userDetails.email,
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form>
                <Stack spacing={2.5}>

                  <Field
                    name="email"
                    label="Email address"
                    as={TextField}
                    type="email"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.email &&
                      Boolean(errors.email)
                    }
                    helperText={
                      touched.email && errors.email
                    }
                    autoComplete="email"
                  />

                  <Field
                    name="password"
                    label="New password"
                    as={TextField}
                    type="password"
                    fullWidth
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.password &&
                      Boolean(errors.password)
                    }
                    helperText={
                      touched.password &&
                      errors.password
                        ? errors.password
                        : 'Leave blank if you do not want to change your password.'
                    }
                    autoComplete="new-password"
                  />

                  {/* PROFILE PICTURE */}
                  <Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight={700}
                      gutterBottom
                    >
                      Profile picture
                    </Typography>

                    <Box
                      {...getRootProps()}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload profile picture"
                      sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                        '&:focus-visible': {
                          outline: '3px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                        },
                      }}
                    >
                      <input {...getInputProps()} />

                      <Typography fontWeight={600}>
                        Drag and drop an image here
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        or select an image from your device
                      </Typography>
                    </Box>

                    {userDetails.profilePicture !==
                      'default.jpg' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          gutterBottom
                        >
                          Profile preview
                        </Typography>

                        <Box
                          component="img"
                          src={userDetails.profilePicture}
                          alt="Your selected profile picture"
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid',
                            borderColor: 'divider',
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      alignSelf: 'flex-start',
                      minWidth: 180,
                    }}
                  >
                    Save account
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Paper>

        {/* APPEARANCE */}
        <Paper
          component="section"
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <DarkMode aria-hidden="true" />

            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
            >
              Appearance
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Customize how the application looks.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(event) =>
                  toggleDarkMode(event.target.checked)
                }
                inputProps={{
                  'aria-label': 'Toggle dark mode',
                }}
              />
            }
            label="Dark mode"
          />
        </Paper>

        {/* ACCESSIBILITY */}
        <Paper
          component="section"
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Accessibility aria-hidden="true" />

            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
            >
              Accessibility
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Adjust the interface to make reading,
            navigation, and interaction easier.
          </Typography>

          <Stack spacing={3}>

            {/* TEXT SIZE */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <FormatSize aria-hidden="true" />

                <Typography
                  component="h3"
                  fontWeight={700}
                >
                  Text size
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Increase the size of text throughout
                the application.
              </Typography>

              <Box sx={{ px: 1 }}>
                <Slider
                  value={accessibility.fontSize}
                  min={90}
                  max={160}
                  step={5}
                  marks={[
                    { value: 90, label: '90%' },
                    { value: 100, label: '100%' },
                    { value: 125, label: '125%' },
                    { value: 150, label: '150%' },
                  ]}
                  valueLabelDisplay="auto"
                  onChange={(_, value) =>
                    updateAccessibility(
                      'fontSize',
                      value
                    )
                  }
                  aria-label="Text size"
                  aria-valuetext={`${accessibility.fontSize}%`}
                />
              </Box>
            </Box>

            <Divider />

            {/* HIGH CONTRAST */}
            <FormControlLabel
              control={
                <Switch
                  checked={accessibility.highContrast}
                  onChange={(event) =>
                    updateAccessibility(
                      'highContrast',
                      event.target.checked
                    )
                  }
                  inputProps={{
                    'aria-label':
                      'Enable high contrast mode',
                  }}
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>
                    High contrast
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Increase contrast between text,
                    backgrounds, and controls.
                  </Typography>
                </Box>
              }
            />

            {/* REDUCED MOTION */}
            <FormControlLabel
              control={
                <Switch
                  checked={accessibility.reducedMotion}
                  onChange={(event) =>
                    updateAccessibility(
                      'reducedMotion',
                      event.target.checked
                    )
                  }
                  inputProps={{
                    'aria-label':
                      'Reduce animations and motion',
                  }}
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Reduce motion
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Reduce animations and movement
                    throughout the application.
                  </Typography>
                </Box>
              }
            />

            {/* DYSLEXIA FONT */}
            <FormControlLabel
              control={
                <Switch
                  checked={accessibility.dyslexiaFont}
                  onChange={(event) =>
                    updateAccessibility(
                      'dyslexiaFont',
                      event.target.checked
                    )
                  }
                  inputProps={{
                    'aria-label':
                      'Enable dyslexia friendly font',
                  }}
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Reading-friendly font
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Use a more distinguishable font
                    for easier reading.
                  </Typography>
                </Box>
              }
            />

            {/* LARGE CURSOR */}
            <FormControlLabel
              control={
                <Switch
                  checked={accessibility.largeCursor}
                  onChange={(event) =>
                    updateAccessibility(
                      'largeCursor',
                      event.target.checked
                    )
                  }
                  inputProps={{
                    'aria-label':
                      'Enable large cursor',
                  }}
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Large cursor
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Increase cursor visibility.
                  </Typography>
                </Box>
              }
            />

            {/* COLOR BLIND MODE */}
            <FormControlLabel
              control={
                <Switch
                  checked={accessibility.colorBlindMode}
                  onChange={(event) =>
                    updateAccessibility(
                      'colorBlindMode',
                      event.target.checked
                    )
                  }
                  inputProps={{
                    'aria-label':
                      'Enable color blind friendly mode',
                  }}
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Color-friendly mode
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Reduce reliance on color alone
                    to communicate information.
                  </Typography>
                </Box>
              }
            />

            {/* FOCUS */}
            <FormControlLabel
              control={
                <Switch
                  checked={accessibility.focusIndicators}
                  onChange={(event) =>
                    updateAccessibility(
                      'focusIndicators',
                      event.target.checked
                    )
                  }
                  inputProps={{
                    'aria-label':
                      'Enable enhanced keyboard focus indicators',
                  }}
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Enhanced keyboard focus
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Make the currently focused
                    control easier to identify.
                  </Typography>
                </Box>
              }
            />

            <Button
              variant="outlined"
              onClick={resetAccessibility}
              sx={{ alignSelf: 'flex-start' }}
            >
              Reset accessibility settings
            </Button>
          </Stack>
        </Paper>

        {/* LANGUAGE */}
        <Paper
          component="section"
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Language aria-hidden="true" />

            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
            >
              Language
            </Typography>
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="language-label">
              Application language
            </InputLabel>

            <Select
              labelId="language-label"
              value={preferences.language}
              label="Application language"
              onChange={(event) =>
                setPreferences((previous) => ({
                  ...previous,
                  language: event.target.value,
                }))
              }
            >
              <MenuItem value="English">
                English
              </MenuItem>

              <MenuItem value="French">
                Français
              </MenuItem>

              <MenuItem value="Spanish">
                Español
              </MenuItem>
            </Select>

            <FormHelperText>
              Choose the language used by the interface.
            </FormHelperText>
          </FormControl>
        </Paper>

        {/* NOTIFICATIONS */}
        <Paper
          component="section"
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Notifications aria-hidden="true" />

            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
            >
              Notifications
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Control the notifications you receive.
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    preferences.emailNotifications
                  }
                  onChange={(event) =>
                    setPreferences((previous) => ({
                      ...previous,
                      emailNotifications:
                        event.target.checked,
                    }))
                  }
                  inputProps={{
                    'aria-label':
                      'Enable email notifications',
                  }}
                />
              }
              label="Email notifications"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.weeklyDigest}
                  onChange={(event) =>
                    setPreferences((previous) => ({
                      ...previous,
                      weeklyDigest:
                        event.target.checked,
                    }))
                  }
                  inputProps={{
                    'aria-label':
                      'Enable weekly class summary',
                  }}
                />
              }
              label="Weekly class summary"
            />
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <Typography
            component="h3"
            fontWeight={700}
            gutterBottom
          >
            Availability
          </Typography>

          <Typography color="text.secondary">
            Monday – Friday, 9:00 AM – 4:00 PM
          </Typography>
        </Paper>

        {/* ACCESSIBILITY INFORMATION */}
        <Alert
          severity="info"
          icon={<Visibility />}
          role="note"
        >
          <Typography fontWeight={700}>
            Accessibility support
          </Typography>

          <Typography variant="body2">
            These settings are saved on this device
            automatically. Your operating system and
            browser accessibility features can also be
            used together with these settings.
          </Typography>
        </Alert>

      </Stack>
    </Container>
  );
};

export default TeacherSettingsPage;