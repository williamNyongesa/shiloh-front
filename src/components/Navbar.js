import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from './context/AuthContext'; 

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate(); 

  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClose = () => {
    setDrawerOpen(false);  
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);  
    navigate('/login');
  };

  const handleLogin = () => {
    setDrawerOpen(false);  
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'Sign Up', path: '/signup', authRequired: false },
    { label: 'Admin', path: '/admin', authRequired: true, roles: ['admin'] },
    { label: 'Student Dashboard', path: '/student', authRequired: true, roles: ['student'] },
    { label: 'Student Registration', path: '/student/registration'},
    { label: 'Enrollment', path: '/enrollment', authRequired: true, roles: ['student'] }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.authRequired) return true;

    if (isAuthenticated() && item.roles && item.roles.includes(user?.role)) {
      return true;
    }
    return false;
  }).filter(item => !(isAuthenticated() && item.label === 'Sign Up'));

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2', zIndex: 1333, width: '100%', display: 'flex' }}>
      <Toolbar sx={{ padding: '0 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, color: '#fff' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
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
          {filteredMenuItems.map(item => (
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
          
          {isAuthenticated() ? (
            <Button
              onClick={handleLogout}
              sx={{
                color: '#fff',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: '#115293',
                  borderRadius: '4px',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              sx={{
                color: '#fff',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: '#115293',
                  borderRadius: '4px',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleMenuClose}
          sx={{ zIndex: 5000 }}
        >
          <Box sx={{ width: 250, padding: '20px' }}>
            <List>
              {filteredMenuItems.map(item => (
                <ListItem button key={item.label} onClick={handleMenuClose}>
                  <ListItemText>
                    <Button
                      component={Link}
                      to={item.path}
                      sx={{
                        color: '#1976d2',
                        fontWeight: '500',
                        width: '100%',
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
              {isAuthenticated() ? (
                <ListItem button onClick={handleLogout}>
                  <ListItemText>
                    <Button
                      sx={{
                        color: '#1976d2',
                        fontWeight: '500',
                        width: '100%',
                        '&:hover': {
                          color: '#115293',
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </ListItemText>
                </ListItem>
              ) : (
                <ListItem button onClick={handleLogin}>
                  <ListItemText>
                    <Button
                      sx={{
                        color: '#1976d2',
                        fontWeight: '500',
                        width: '100%',
                        '&:hover': {
                          color: '#115293',
                        },
                      }}
                    >
                      Login
                    </Button>
                  </ListItemText>
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
