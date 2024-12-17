import React, { useState, useCallback } from 'react';
import { TextField, Button, Box, Typography, Switch, Paper, Alert } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// SettingsPage Component
const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  const [userDetails, setUserDetails] = useState({
    name: user.username,
    email: user.email,
    profilePicture: 'default.jpg', // initial default image
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profilePicture: reader.result, // Store base64 image string
      }));
    };
    reader.readAsDataURL(file); // Converts image to base64
  }, []);

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop,
  //   accept: 'image/*',
  //   maxFiles: 1,
  //   multiple: false,
  // });

  const token = localStorage.getItem('access_token'); // Get JWT token from localStorage

  // Handle form submission
  const handleSubmit = async (values) => {
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    // Append email and password if provided
    if (values.email) formData.append('email', values.email);
    if (values.password) formData.append('password', values.password);

    // // Append the profile picture
    // if (userDetails.profilePicture !== 'default.jpg') {
    //   formData.append('profilePicture', userDetails.profilePicture); // This is base64 string
    // }
    console.log(values)

    try {
      const response = await axios.put('https://shiloh-server.onrender.com/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Important to specify for file uploads
        },
      });
      setSuccessMessage('User data updated successfully!');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
      <Paper sx={{ padding: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Update User Data
        </Typography>

        {successMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

        <Formik
          initialValues={{ email: userDetails.email, password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
              <Field
                name="email"
                label="Email"
                as={TextField}
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ marginBottom: 2 }}
              />
              <Field
                name="password"
                label="Password"
                as={TextField}
                type="password"
                fullWidth
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ marginBottom: 2 }}
              />

              {/* Profile Picture Upload Section
              <Paper sx={{ padding: 3, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ marginTop: 3 }}>
                  <Typography variant="body1">Upload Profile Picture</Typography>
                  <div {...getRootProps()} style={styles.dropzone}>
                    <input {...getInputProps()} />
                    <Typography sx={{ color: darkMode ? '#fff' : '#000' }}>
                      Drag & drop a picture here, or click to select a file
                    </Typography>
                  </div>
                  {userDetails.profilePicture !== 'default.jpg' && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="body2">Preview:</Typography>
                      <img
                        src={userDetails.profilePicture}
                        alt="Profile"
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          border: `4px solid ${darkMode ? '#fff' : '#000'}`,
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper> */}

              <Button variant="contained" color="primary" fullWidth type="submit">
                Update
              </Button>
            </Form>
          )}
        </Formik>
      <Box sx={{ padding: 4 }}>
        {/* Dark Mode Toggle */}
        <Box sx={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: 2, color: darkMode ? '#fff' : '#000' }}>
            Dark Mode
          </Typography>
          <Switch
            checked={darkMode}
            onChange={(e) => toggleDarkMode(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Box>
        {/* Action Buttons
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box> */}
      </Box>
      </Paper>

    </Box>
  );
};

const styles = {
  dropzone: {
    border: '2px dashed #A3A3A3',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '10px',
    borderRadius: 4,
  },
};

export default SettingsPage;


// SettingsPage Component (main settings page with all sections)
// const SettingsPage = () => {
//   const { darkMode, toggleDarkMode } = useTheme();
//   const user = JSON.parse(localStorage.getItem('user'));
//   const [userDetails, setUserDetails] = useState({
//     name: user.username,
//     email: user.email,
//     profilePicture: 'default.jpg',
//   });

//   const [notificationSettings, setNotificationSettings] = useState({
//     email: true,
//     sms: false,
//     push: true,
//   });

//   const [privacySettings, setPrivacySettings] = useState({
//     profileVisibility: 'everyone',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserDetails({
//       ...userDetails,
//       [name]: value,
//     });
//   };

//   const handleNotificationChange = (e) => {
//     const { name, checked } = e.target;
//     setNotificationSettings({
//       ...notificationSettings,
//       [name]: checked,
//     });
//   };

//   const handlePrivacyChange = (e) => {
//     const { value } = e.target;
//     setPrivacySettings({
//       ...privacySettings,
//       profileVisibility: value,
//     });
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUserDetails((prevDetails) => ({
//         ...prevDetails,
//         profilePicture: reader.result, // Store base64 image string
//       }));
//     };
//     reader.readAsDataURL(file); // Converts image to base64
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: 'image/*',
//     maxFiles: 1,
//     multiple: false,
//   });

//   const handleSave = () => {
//     alert('Settings saved!');
//   };

//   const handleCancel = () => {
//     alert('Changes discarded.');
//   };

//   return (
//     <Box sx={{ padding: 4 }}>
//       {/* Profile Information Section */}
//       <Paper sx={{ padding: 3, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}>
//         <Typography variant="h6" sx={{ marginBottom: 2 }}>Profile Information</Typography>
//         <TextField
//           label="Full Name"
//           name="name"
//           value={userDetails.name}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />
//         <TextField
//           label="Email Address"
//           name="email"
//           value={userDetails.email}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />
//         {/* Profile Picture Upload Section */}
//         <Box sx={{ marginTop: 3 }}>
//           <Typography variant="body1">Upload Profile Picture</Typography>
//           <div {...getRootProps()} style={styles.dropzone}>
//             <input {...getInputProps()} />
//             <Typography sx={{ color: darkMode ? '#fff' : '#000' }}>
//               Drag & drop a picture here, or click to select a file
//             </Typography>
//           </div>
//           {userDetails.profilePicture !== 'default.jpg' && (
//             <Box sx={{ marginTop: 2 }}>
//               <Typography variant="body2">Preview:</Typography>
//               <img
//                 src={userDetails.profilePicture}
//                 alt="Profile"
//                 style={{
//                   width: 120,
//                   height: 120,
//                   borderRadius: '50%',
//                   border: `4px solid ${darkMode ? '#fff' : '#000'}`,
//                   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
//                 }}
//               />
//             </Box>
//           )}
//         </Box>
//       </Paper>

//       {/* Notification Preferences Section */}
//       <Paper sx={{ padding: 3, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}>
//         <Typography variant="h6" sx={{ marginBottom: 2 }}>Notification Preferences</Typography>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={notificationSettings.email}
//               onChange={handleNotificationChange}
//               name="email"
//               color="primary"
//             />
//           }
//           label="Email Notifications"
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={notificationSettings.sms}
//               onChange={handleNotificationChange}
//               name="sms"
//               color="primary"
//             />
//           }
//           label="SMS Notifications"
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={notificationSettings.push}
//               onChange={handleNotificationChange}
//               name="push"
//               color="primary"
//             />
//           }
//           label="Push Notifications"
//         />
//       </Paper>

//       {/* Privacy Settings Section */}
//       <Paper sx={{ padding: 3, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}>
//         <Typography variant="h6" sx={{ marginBottom: 2 }}>Privacy Settings</Typography>
//         <FormControl fullWidth margin="normal" variant="outlined">
//           <InputLabel>Profile Visibility</InputLabel>
//           <Select
//             value={privacySettings.profileVisibility}
//             onChange={handlePrivacyChange}
//             label="Profile Visibility"
//             sx={{
//               backgroundColor: darkMode ? '#333' : '#f4f4f4',
//               color: darkMode ? '#fff' : '#000',
//             }}
//           >
//             <MenuItem value="everyone">Everyone</MenuItem>
//             <MenuItem value="teachers">Teachers Only</MenuItem>
//             <MenuItem value="no one">No One</MenuItem>
//           </Select>
//         </FormControl>
//       </Paper>

//       {/* Dark Mode Toggle */}
//       <Box sx={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
//         <Typography variant="body1" sx={{ marginRight: 2, color: darkMode ? '#fff' : '#000' }}>
//           Dark Mode
//         </Typography>
//         <Switch
//           checked={darkMode}
//           onChange={(e) => toggleDarkMode(e.target.checked)}
//           inputProps={{ 'aria-label': 'controlled' }}
//         />
//       </Box>

//       {/* Update User Section */}
//       <UpdateUser />

//       {/* Action Buttons */}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSave}
//           sx={{ marginRight: 2 }}
//         >
//           Save Changes
//         </Button>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={handleCancel}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };


