import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Box, Typography, Switch } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const SettingsPage = () => {
const { darkMode, toggleDarkMode } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'))
  const [userDetails, setUserDetails] = useState({
    name: user.username,
    email: user.email,
    profilePicture: 'default.jpg',
  });


  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'everyone',
  });

  const [theme, setTheme] = useState('light');
  const handleThemeChange = (e) => {
    const { value } = e.target;
    setTheme(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handlePrivacyChange = (e) => {
    const { value } = e.target;
    setPrivacySettings({
      ...privacySettings,
      profileVisibility: value,
    });
  };


  const handleSave = () => {
    alert('Settings saved!');
  };

  const handleCancel = () => {
    alert('Changes discarded.');
  };

  return (
    <Box sx={{ padding: 4 }}>
          {/* Profile Information Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Profile Information</Typography>
        <TextField
          label="Full Name"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email Address"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="outlined" component="label" sx={{ marginTop: 2 }}>
          Upload Profile Picture
          <input type="file" hidden />
        </Button>
      </Box>

      {/* Notification Preferences Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Notification Preferences</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationSettings.email}
              onChange={handleNotificationChange}
              name="email"
            />
          }
          label="Email Notifications"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationSettings.sms}
              onChange={handleNotificationChange}
              name="sms"
            />
          }
          label="SMS Notifications"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationSettings.push}
              onChange={handleNotificationChange}
              name="push"
            />
          }
          label="Push Notifications"
        />
      </Box>

      {/* Privacy Settings Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Privacy Settings</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Profile Visibility</InputLabel>
          <Select
            value={privacySettings.profileVisibility}
            onChange={handlePrivacyChange}
            label="Profile Visibility"
          >
            <MenuItem value="everyone">Everyone</MenuItem>
            <MenuItem value="teachers">Teachers Only</MenuItem>
            <MenuItem value="no one">No One</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <label>
        Dark Mode
        <Switch
          checked={darkMode}
          onChange={(e) => toggleDarkMode(e.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </label>

      {/* Action Buttons */}
      <Box>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginRight: 2 }}>
          Save Changes
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
