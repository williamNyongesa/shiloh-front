import React, { useState } from 'react';
import { Box,  IconButton, Pagination as MUITextPagination } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Define total pages

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box>

      <MUITextPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        siblingCount={1}
        boundaryCount={1}
        shape="rounded"
        />
    </Box>
  );
};

export default Pagination;
