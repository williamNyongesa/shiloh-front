import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar, Alert, Box, Paper, Skeleton } from '@mui/material';

const Notification = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://shiloh-server.onrender.com//communication/notifications');
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);


    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>            
            <Box mt={4}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Notifications
                </Typography>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={118} />
                ) : (
                    notifications && notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Box key={notification.id} p={2} m={1} component={Paper} elevation={3}>
                                <Typography variant="subtitle1">{`Type: ${notification.type}`}</Typography>
                                <Typography variant="subtitle1">{`Subject: ${notification.subject}`}</Typography>
                                <Typography variant="body1">{`Message: ${notification.message}`}</Typography>
                                <Typography variant="body2" color="textSecondary">{`Timestamp: ${new Date(notification.timestamp).toLocaleString()}`}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">No notifications available.</Typography>
                    )
                )}
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Notification;