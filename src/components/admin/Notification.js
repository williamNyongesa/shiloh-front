import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Snackbar, Alert, Box, Paper, Skeleton } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const Notification = () => {
    const [notificationType, setNotificationType] = useState('');
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/communication/notifications');
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

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch('http://localhost:5000/communication/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();
            setSnackbarMessage(result.message);
            setOpenSnackbar(true);
            if (result.notification) {
                setNotifications(prevNotifications => [...prevNotifications, result.notification]);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Notification type is required'),
        recipient: Yup.string().required('Recipient is required'),
        message: Yup.string().required('Message is required'),
    });

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Send Notification
            </Typography>
            <Formik
                initialValues={{ type: '', recipient: '', message: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field
                            as={TextField}
                            select
                            label="Notification Type"
                            name="type"
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="sms">SMS</MenuItem>
                        </Field>
                        <Field
                            as={TextField}
                            label="Recipient"
                            name="recipient"
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Field
                            as={TextField}
                            label="Message"
                            name="message"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }} disabled={isSubmitting}>
                            Send
                        </Button>
                    </Form>
                )}
            </Formik>
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