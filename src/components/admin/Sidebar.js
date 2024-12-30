import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Box } from '@mui/material';
import { Wallet, AccountBalance, Payment } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          marginTop: '50px',
          width: 240,
          backgroundColor: '#2c3e50', 
          color: 'white',
          paddingTop: 2,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
        <Box sx={{ width: '80%', height: 'auto', paddingBottom: 2 }}>
          <img src="/logo192.png" alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </Box>

        <List sx={{ width: '100%' }}>
          <ListItem button sx={{ padding: 2, justifyContent: 'flex-start', '&:hover': { backgroundColor: '#34495e' } }}>
            <ListItemIcon>
              <Wallet sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Wallet" sx={{ textAlign: 'left', color: 'white' }} />
          </ListItem>
          <Divider sx={{ backgroundColor: '#ecf0f1' }} />

          <ListItem button sx={{ padding: 2, justifyContent: 'flex-start', '&:hover': { backgroundColor: '#34495e' } }}>
            <ListItemIcon>
              <AccountBalance sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Debt" sx={{ textAlign: 'left', color: 'white' }} />
          </ListItem>
          <Divider sx={{ backgroundColor: '#ecf0f1' }} />

          <ListItem button sx={{ padding: 2, justifyContent: 'flex-start', '&:hover': { backgroundColor: '#34495e' } }}>
            <ListItemIcon>
              <Payment sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Payment Admin Dashboard" sx={{ textAlign: 'left', color: 'white' }} />
          </ListItem>
          <Divider sx={{ backgroundColor: '#ecf0f1' }} />
          
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
