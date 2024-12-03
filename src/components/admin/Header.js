import React from "react";
import { AppBar, Toolbar, Typography, IconButton, TextField, Badge, Box } from "@mui/material";
import { Search, Notifications, Email } from "@mui/icons-material";

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'secondary.main', padding: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative', width: '250px' }}>
            <TextField
              variant="outlined"
              placeholder="Search Here..."
              fullWidth
              sx={{
                paddingLeft: 3,
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiInputBase-root': { padding: 1 },
              }}
              slotProps={{
                startAdornment: (
                  <IconButton sx={{ position: 'absolute', left: 8 }}>
                    <Search sx={{ color: 'gray' }} />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <IconButton sx={{ position: 'relative' }}>
            <Notifications sx={{ color: 'white' }} />
            <Badge
              badgeContent={9}
              color="error"
              sx={{
                position: 'absolute',
                bottom: 4,
                left: 3,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                borderRadius: '50%',
                padding: '0 5px',
              }}
            />
          </IconButton>

          <IconButton sx={{ position: 'relative' }}>
            <Email sx={{ color: 'white' }} />
            <Badge
              badgeContent={3}
              color="warning"
              sx={{
                position: 'absolute',
                bottom: 4,
                left: 3,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                borderRadius: '50%',
                padding: '0 5px',
              }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
