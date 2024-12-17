import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Importing axios for API calls
import { Box, Container, Typography, Paper, Card, CardContent, CardHeader, Divider, Skeleton, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const EventsPage = () => {
  const [events, setEvents] = useState(null);  // Initialize events state as null
  const [loading, setLoading] = useState(true);  // Track loading state

  // Fetch events data from the backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://shiloh-server.onrender.com/events');  // Replace with actual API endpoint
        setEvents(response.data);  // Update the state with fetched events
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);  // Set loading to false even on error
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    const newEvent = {
      title: 'New Event',
      date: '2024-12-20',
      description: 'A brand new event for the community.',
      time: '10:00 AM - 12:00 PM',
      location: 'Community Hall',
    };

    try {
      const response = await axios.post('https://shiloh-server.onrender.com/events/submit-event', newEvent);
      setEvents((prevEvents) => [...prevEvents, response.data.event]);  // Add new event to the list
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (eventId) => {
    const updatedEvent = {
      title: 'Updated Event',
      date: '2024-12-21',
      description: 'Updated description of the event.',
      time: '1:00 PM - 3:00 PM',
      location: 'Updated Location',
    };

    try {
      const response = await axios.put(`https://shiloh-server.onrender.com/events/${eventId}`, updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === eventId ? response.data.event : event))
      );
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://shiloh-server.onrender.com/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));  // Remove event from list
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginTop: 3 }}>Upcoming Events</Typography>
      <Divider sx={{ margin: '20px 0' }} />

      {loading ? (
        <Box>
          {[...Array(4)].map((_, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardHeader
                title={<Skeleton width="60%" />}
                subheader={<Skeleton width="40%" />}
                action={<Skeleton variant="circular" width={40} height={40} />}
              />
              <Accordion>
                <AccordionDetails>
                  <CardContent>
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                    <Skeleton width="90%" />
                  </CardContent>
                </AccordionDetails>
              </Accordion>
            </Card>
          ))}
        </Box>
      ) : (
        events && events.length > 0 ? (
          events.map((event, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardHeader
                title={event.title}
                subheader={event.date}
                // action={<AccordionSummary expandIcon={<ExpandMoreIcon />} />}
              />
              <Accordion>
                <AccordionDetails>
                  <CardContent>
                    <Typography variant="body1">Time: {event.time}</Typography>
                    <Typography variant="body1">Location: {event.location}</Typography>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                      {event.description}
                    </Typography>
                    {/* <Box sx={{ marginTop: 2 }}>
                      <Button onClick={() => handleUpdateEvent(event.id)} variant="outlined">Update Event</Button>
                      <Button onClick={() => handleDeleteEvent(event.id)} variant="outlined" color="error" sx={{ marginLeft: 2 }}>
                        Delete Event
                      </Button>
                    </Box> */}
                  </CardContent>
                </AccordionDetails>
              </Accordion>
            </Card>
          ))
        ) : (
          <Typography variant="body1" sx={{ marginTop: 3 }}>No events available</Typography>
        )
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        {/* <Button
          variant="contained"
          sx={{
            backgroundColor: '#2196F3',
            '&:hover': { backgroundColor: '#1976D2' },
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
          onClick={handleCreateEvent}
        >
          Add New Event
        </Button> */}
      </Box>
    </Container>
  );
};

export default EventsPage;
