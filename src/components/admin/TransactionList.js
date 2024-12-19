import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Divider, Skeleton } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Header from './Header';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true); // State for loading indication
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
      {/* <Header/> */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Latest Transactions
      </Typography>
      
      {loading ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Skeleton variant="text" width="120px" /></TableCell>
                <TableCell><Skeleton variant="text" width="80px" /></TableCell>
                <TableCell><Skeleton variant="text" width="120px" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width="120px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="80px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="120px" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No transactions available</TableCell>
                </TableRow>
              ) : (
                currentTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.transaction_type}</TableCell>
                    <TableCell>Ksh {t.amount}</TableCell>
                    <TableCell>{t.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
