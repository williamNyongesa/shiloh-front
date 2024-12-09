import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, TextField, Badge, Box, Autocomplete } from "@mui/material";
import { Search, Notifications, Email } from "@mui/icons-material";

const Header = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]); 
  const [inputValue, setInputValue] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const baseUrl = process.env.BASE_URL;

  // move this section to an isolated file for reusability
  // #####################################################################
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchData = async (query) => {
    if (!query) {
      setSearchResults([]);
      setFilteredResults([]);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`https://shiloh-server.onrender.com/finances`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
      setFilteredResults(data.filter((transaction) =>
        transaction.description.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (error) {
      console.error("Error fetching data:", error); 
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);  
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  
  const debouncedFetchData = debounce(fetchData, 500); 
  useEffect(() => {
    debouncedFetchData(inputValue);
  }, [inputValue]);
// #####################################################################

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'secondary.main', padding: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '300px' } }}>
      <Autocomplete
      freeSolo
      id="search-bar"
      disableClearable
      options={filteredResults.map((option) => option.description)}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          fullWidth
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            '& .MuiInputBase-root': {
              paddingLeft: 4,
              fontSize: '1rem',
              height: '45px', // Adjusted height for better UI
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Hover effect
            },
            // Gradient Label
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              background:'linear-gradient(to bottom, #fff, #000)',
              WebkitBackgroundClip: 'text', // Clip the background to the text
              color: 'transparent', // Make the text color transparent so gradient shows
              padding: '0 4px', // Prevent clipping of the label text
            },
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <IconButton sx={{ position: 'absolute', left: 8, color: '#007bff' }}>
                  <Search sx={{ fontSize: 24 }} />
                </IconButton>
              ),
              type: 'search',
            },
          }}
        />
      )}
    />
      </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
