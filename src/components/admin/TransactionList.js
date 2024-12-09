import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, Typography, Divider, Skeleton } from '@mui/material';
import Pagination from '@mui/material/Pagination';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [loading, setLoading] = useState(true);  // State for loading indication
  const baseUrl = process.env.BASE_URL;

  
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`https://shiloh-server.onrender.com/finances`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data); 
      setLoading(false); 
      console.log(data);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(); 
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); 
  };

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 3, padding: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Latest Transactions
      </Typography>
      
      {loading ? (
        <List>
          {[...Array(5)].map((_, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
              <Box>
                <Skeleton variant="text" width="150px" />
              </Box>

              <Box>
                <Skeleton variant="text" width="80px" />
              </Box>

              <Box>
                <Skeleton variant="text" width="120px" />
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          {currentTransactions.length === 0 ? (
            <Typography>No transactions available</Typography>
          ) : (
            currentTransactions.map((t) => (
              <ListItem key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'gray' }}>
                    {t.transaction_type}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                    Ksh {t.amount}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'gray' }}>
                    {t.date}
                  </Typography>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      )}
      
      <Divider sx={{ marginY: 2 }} />
      
      <Pagination
        count={Math.ceil(transactions.length / itemsPerPage)} 
        page={currentPage} 
        onChange={handlePageChange} 
        color="primary"
      />
    </Box>
  );
};

export default TransactionList;
