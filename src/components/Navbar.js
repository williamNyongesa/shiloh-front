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

  const publicMenuItems = [
    { label: 'Explore', path: '/' },
    { label: 'Sign up', path: '/signup' },
  ];
  const roleMenuItems = {
    student: [
      { label: 'About learning', path: '/home' },
      { label: 'Dashboard', path: '/student' },
      { label: 'Enrollment', path: '/enrollment' },
    ],
    teacher: [{ label: 'Dashboard', path: '/teacher' }],
    admin: [{ label: 'Dashboard', path: '/admin' }],
  };
  const filteredMenuItems = isAuthenticated() ? (roleMenuItems[user?.role] || []) : publicMenuItems;


  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', zIndex: 1333, width: '100%', display: 'flex' }}>
      <Toolbar sx={{ padding: '0 clamp(16px, 4vw, 40px)', minHeight: 68 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, color: '#fff' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-.4px', color: "Highlight"}}>
            Shiloh <Box component="span" sx={{ color: 'primary.main' }}>College</Box>
          </Typography>
        </Box>

        <IconButton
          sx={{ display: { xs: 'block', md: 'none' }, color: 'text.primary' }}
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
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
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
                color: 'text.secondary',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: 'action.hover',
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
                color: 'text.secondary',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: 'action.hover',
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
