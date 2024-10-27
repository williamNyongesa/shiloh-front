import React, { useState } from 'react';

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; 

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
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* Previous Button */}
      {currentPage > 1 && (
        <button
          onClick={handlePrevious}
          className="p-2 rounded-lg bg-gray-300 text-gray-700"
        >
          <span className="material-icons">navigate_before</span>
        </button>
      )}

      {/* Page Buttons */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`p-2 rounded-lg ${
            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      {currentPage < totalPages && (
        <button
          onClick={handleNext}
          className="p-2 rounded-lg bg-gray-300 text-gray-700"
        >
          <span className="material-icons">navigate_next</span>
        </button>
      )}
    </div>
  );
};

export default Pagination;
