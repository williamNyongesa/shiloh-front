import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, Box } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace this with your Stripe public key
const STRIPE_PUBLIC_KEY = 'your-stripe-public-key-here'; // Replace with your actual key

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const FinancePage = () => {
  const [amount, setAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitPayment = async (event, stripe, elements) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a payment method with the card details
    const { token, error: stripeError } = await stripe.createToken(cardElement);

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    // Make a request to your Flask backend to process the payment with the token
    try {
      const response = await fetch('http://localhost:5000/api/charge', {  // Adjust the URL if your Flask app is hosted elsewhere
        method: 'POST',
        body: JSON.stringify({ token: token.id, amount: amount }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        setError(null);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <Box sx={{margin:"2rem", padding:3}}>
        <Container maxWidth="sm">
        <Paper style={{ padding: 16 }}>
            <Typography variant="h4" gutterBottom>
            Student Payment Page
            </Typography>

            <Typography variant="body1" gutterBottom>
            Please enter the amount you want to pay.
            </Typography>

            <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            />

            <Typography variant="h6" gutterBottom>
            Enter Payment Details:
            </Typography>

            <Elements stripe={stripePromise}>
            <CardPaymentForm handleSubmit={handleSubmitPayment} />
            </Elements>

            {paymentSuccess && <Typography color="green">Payment Successful!</Typography>}
            {error && <Typography color="red">{error}</Typography>}
        </Paper>
        </Container>
    </Box>
  );
};

const CardPaymentForm = ({ handleSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <Box>
        <form onSubmit={(e) => handleSubmit(e, stripe, elements)}>
            <CardElement style={{ marginBottom: '16px' }} />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!stripe}
                fullWidth
                >
                Pay Now
            </Button>
        </form>
    </Box>
  );
};

export default FinancePage;
