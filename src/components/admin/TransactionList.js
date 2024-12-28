import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Divider, Skeleton, Paper } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Header from './Header';
import SearchBar from '../Searchbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true); // State for loading indication
  const baseUrl = process.env.BASE_URL;
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      const response = await axios.post('http://localhost:5000/users/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refresh_token}`
        }
      });

      if (response.status === 200) {
        const newToken = response.data.access_token;
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('tokenExpiration', JSON.stringify(new Date().getTime() + 60 * 60 * 1000)); // Assuming token is valid for 1 hour
        return newToken;
      } else {
        console.error("Error refreshing token", response.statusText);
        navigate('/login');
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      navigate('/login');
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setTransactions([]); // Ensure transactions is an array before fetching
    try {
      let token = localStorage.getItem('access_token');
      console.log("Token before fetch:", token); // Debugging statement

      const response = await fetch(`http://localhost:5000/finances`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
          console.log("New token after refresh:", token); // Debugging statement

          const retryResponse = await fetch(`http://localhost:5000/finances`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const retryData = await retryResponse.json();
          setTransactions(retryData);
        }
      } else {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
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
      <SearchBar fetchData={fetchTransactions} placeholder="Search transactions..." dataKey="description" />
      
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
