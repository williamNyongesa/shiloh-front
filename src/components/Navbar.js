import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClose = () => {
    setDrawerOpen(false);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Sign Up', path: '/signup' },
    { label: 'Login', path: '/login' },
    { label: 'Admin', path: '/admin' },
    { label: 'Student Dashboard', path: '/student' },
    { label: 'Student Registration', path: '/student/registration' },
    { label: 'Enrollment', path: '/enrollment' }
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ padding: '0 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, color: '#fff', }}>
          <Typography variant="h6" sx={{ flexGrow: 1,  fontWeight: 600 }} >
            Shiloh College
          </Typography>
        </Box>

        <IconButton
          sx={{ display: { xs: 'block', md: 'none' }, color: '#fff' }}
          edge="end"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {menuItems.map(item => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#115293',
                  borderRadius: '4px',
                },
                fontWeight: '500',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleMenuClose}
        >
          <Box sx={{ width: 250, padding: '20px' }}>
            <List>
              {menuItems.map(item => (
                <ListItem button key={item.label} onClick={handleMenuClose}>
                  <ListItemText>
                    <Button
                      component={Link}
                      to={item.path}
                      sx={{
                        color: '#1976d2',
                        fontWeight: '500',
                        width:'100%',
                        '&:hover': {
                          color: '#115293',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
