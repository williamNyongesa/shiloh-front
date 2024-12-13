import React from 'react';
import { Container, Box, Typography, Paper, Button, Divider } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import StripeCheckout from 'react-stripe-checkout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Sample financial data
const financialData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Outstanding Balance',
      data: [200, 150, 180, 120, 100, 60],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    },
  ],
};

const studentFinancialInfo = {
  name: "John Doe",
  studentId: "S12345678",
  balance: 60,  // Final outstanding balance
  totalPaid: 1500,
  totalDue: 1800,
};

const PaymentSection = () => {
  const handleToken = (token) => {
    console.log('Payment Success', token);
    // Call your backend API to handle the Stripe payment
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6">Pay Your Fees</Typography>
      <Divider sx={{ marginY: 2 }} />
      <StripeCheckout
        stripeKey="your-publishable-key"  // Use your Stripe public key
        token={handleToken}
        amount={studentFinancialInfo.balance * 100}  // Convert to cents
        name="Student Fee Payment"
        description="Pay for your outstanding balance"
        currency="USD"
      >
        <Button variant="contained" color="primary">Pay Now</Button>
      </StripeCheckout>
    </Paper>
  );
};

const FinancialDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}> {/* Prevent horizontal overflow */}
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          <Typography variant="h4" gutterBottom color="secondary">
            Welcome, {studentFinancialInfo.name}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
            {/* Financial Overview */}
            <Box sx={{ flex: '1 1 100%', sm: '1 1 30%', maxWidth: '100%' }}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Student ID</Typography>
                <Typography variant="body1">{studentFinancialInfo.studentId}</Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 100%', sm: '1 1 30%', maxWidth: '100%' }}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Total Balance</Typography>
                <Typography variant="body1">${studentFinancialInfo.balance}</Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 100%', sm: '1 1 30%', maxWidth: '100%' }}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Total Paid</Typography>
                <Typography variant="body1">${studentFinancialInfo.totalPaid}</Typography>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 60%' }, display: 'flex', flexDirection: 'column', maxWidth: '95%' }}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>Financial Overview</Typography>
                <Line data={financialData} options={{ responsive: true }} />
              </Paper>
            </Box>

            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 40%' }, display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
              <PaymentSection />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FinancialDashboard;
