import React, { useState, useEffect } from "react";
import { TextField, IconButton, Autocomplete } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = ({ fetchData, placeholder, dataKey, debounceDelay = 500 }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Debounced fetch function
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedFetchData = debounce((...args) => {
        if (typeof fetchData === 'function') {
            fetchData(...args);
        }
    }, debounceDelay);

    // Fetch data based on input value
    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        debouncedFetchData(newInputValue);
    };

    useEffect(() => {
        if (!inputValue) {
            setSearchResults([]);
            setFilteredResults([]);
        }
    }, [inputValue]);

    useEffect(() => {
        if (searchResults.length && inputValue) {
            setFilteredResults(
                searchResults.filter(item => 
                    item.some(subItem => 
                        subItem[dataKey].toLowerCase().includes(inputValue.toLowerCase())
                    )
                )
            );
        }
    }, [inputValue, searchResults, dataKey]);

    return (
        <Autocomplete
            freeSolo
            disableClearable
            options={filteredResults.flat().map((option) => option[dataKey])}
            onInputChange={handleInputChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={placeholder}
                    fullWidth
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: 3,
                        '& .MuiInputBase-root': {
                            paddingLeft: 4,
                            fontSize: '1rem',
                            height: '45px',
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
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                        },
                        '& .MuiInputLabel-root': {
                            fontWeight: 500,
                            background: 'linear-gradient(to bottom, #fff, #000)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            padding: '0 4px',
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
    );
};

export default SearchBar;
