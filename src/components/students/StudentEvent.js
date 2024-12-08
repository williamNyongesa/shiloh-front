import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, CardHeader, Divider, Skeleton, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const EventsPage = () => {
  const [events, setEvents] = useState(null);  // Events state initialized as null to simulate loading state

  // Simulating an API call to fetch events data
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        {
          title: 'Math Exam',
          date: '2024-12-10',
          description: 'Midterm exam for the Math 101 course.',
          time: '10:00 AM - 12:00 PM',
          location: 'Room 101'
        },
        {
          title: 'School Sports Day',
          date: '2024-12-12',
          description: 'A day full of sporting events and competitions.',
          time: '8:00 AM - 4:00 PM',
          location: 'Sports Ground'
        },
        {
          title: 'Parent-Teacher Meeting',
          date: '2024-12-15',
          description: 'A session for parents to meet teachers and discuss progress.',
          time: '2:00 PM - 5:00 PM',
          location: 'Room 202'
        },
        {
          title: 'Cultural Night',
          date: '2024-12-18',
          description: 'A night showcasing cultural performances and activities.',
          time: '6:00 PM - 9:00 PM',
          location: 'Auditorium'
        }
      ]);
    }, 2000);  // Simulate a 2-second delay for fetching events data
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginTop: 3 }}>Upcoming Events</Typography>

      <Divider sx={{ margin: '20px 0' }} />

      {events ? (
        events.map((event, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardHeader
              title={event.title}
              subheader={event.date}
              action={<AccordionSummary expandIcon={<ExpandMoreIcon />} />}
            />
            <Accordion>
              <AccordionDetails>
                <CardContent>
                  <Typography variant="body1">Time: {event.time}</Typography>
                  <Typography variant="body1">Location: {event.location}</Typography>
                  <Typography variant="body2" sx={{ marginTop: 2 }}>
                    {event.description}
                  </Typography>
                </CardContent>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      ) : (
        // Skeleton loading state
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
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2196F3',
            '&:hover': { backgroundColor: '#1976D2' },
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
        >
          View All Events
        </Button>
      </Box>
    </Container>
  );
};

export default EventsPage;
