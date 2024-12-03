import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import Pagination from './Pagination';

const TransactionList = () => {
  const transactions = [
    { id: "#KLA-237-393-950", name: "CodeAstrology.com", amount: "$4,67,859", time: "5 min ago" },
    { id: "#KLA-237-393-950", name: "HSJ Express.com", amount: "$89,859", time: "10 min ago" },
    { id: "#KLA-237-393-950", name: "InventiveShamin.Inc", amount: "$3,43,67,859", time: "15 min ago" },
    { id: "#KLA-237-393-950", name: "AvadaroLife.Inc", amount: "$2,07,859", time: "20 min ago" },
  ];

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 3, padding: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Latest Transactions
      </Typography>
      <List>
        {transactions.map((transaction, index) => (
          <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {transaction.id}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                {transaction.name}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {transaction.amount}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {transaction.time}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginY: 2 }} />
      <Pagination sx={{ display: 'flex' }}/>
    </Box>
  );
};

export default TransactionList;
