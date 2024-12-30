import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Button, Modal, TextField } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { styled } from '@mui/system';

const SchoolCalendar = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalEvent, setModalEvent] = useState(null); // For new event or editing an event
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');

  // Dummy event data
  const dummyEvents = [
    {
      title: 'School Opening Day',
      start: '2024-01-15T08:00:00',
      end: '2024-01-15T15:00:00',
      description: 'First day of school, orientation.'
    },
    {
      title: 'Sports Day',
      start: '2024-03-20T09:00:00',
      end: '2024-03-20T16:00:00',
      description: 'Annual sports day event.'
    },
    {
      title: 'Midterm Exam',
      start: '2024-05-01T09:00:00',
      end: '2024-05-01T12:00:00',
      description: 'Midterm exam for all students.'
    },
    {
      title: 'Parent-Teacher Meeting',
      start: '2024-06-10T14:00:00',
      end: '2024-06-10T17:00:00',
      description: 'Meeting between parents and teachers to discuss student progress.'
    },
    {
      title: 'Summer Vacation',
      start: '2024-07-01T00:00:00',
      end: '2024-07-31T23:59:59',
      description: 'School break for the summer holidays.'
    },
    {
      title: 'Graduation Day',
      start: '2024-08-15T10:00:00',
      end: '2024-08-15T14:00:00',
      description: 'Celebrating the graduation of this year’s students.'
    }
  ];

  // Fetch events or use dummy data
  useEffect(() => {
    // Simulate an API call
    setEvents(dummyEvents);
  }, []);

  // Open modal for adding or editing an event
  const handleModalOpen = (event = null) => {
    if (event) {
      setTitle(event.title);
      setStart(event.start);
      setEnd(event.end);
      setDescription(event.description);
      setModalEvent(event);
    } else {
      setTitle('');
      setStart('');
      setEnd('');
      setDescription('');
      setModalEvent(null);
    }
    setOpenModal(true);
  };

  // Handle form submission (Add or Edit event)
  const handleFormSubmit = () => {
    if (modalEvent) {
      // Edit the event
      const updatedEvents = events.map(e => 
        e === modalEvent ? { ...e, title, start, end, description } : e
      );
      setEvents(updatedEvents);
    } else {
      // Add a new event
      const newEvent = { title, start, end, description };
      setEvents([...events, newEvent]);
    }
    setOpenModal(false);
  };

  // Handle modal close without saving
  const handleModalClose = () => {
    setOpenModal(false);
  };

  return (
    <Container>
      <Box sx={{ paddingTop: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#2E3B55' }} gutterBottom>
          School Calendar
        </Typography>

        {/* Calendar Wrapper with Shadow and Rounded Corners */}
        <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={info => handleModalOpen(info.event)}
            headerToolbar={{
              start: 'today prev,next', // Navigation buttons on left
              center: 'title', // Calendar title in the center
              end: 'dayGridMonth,timeGridWeek,timeGridDay', // View options on the right
            }}
            eventColor="#2196F3" // Color for event titles
            height="80vh" // Set the height of the calendar
          />
        </Paper>
      </Box>

      {/* Stylish Button to Add Event or Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF5722',
            '&:hover': {
              backgroundColor: '#FF7043',
            },
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
          onClick={() => handleModalOpen()}  // Open modal to add a new event
        >
          Add New Event
        </Button>
      </Box>

      {/* Modal for adding/editing events */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ padding: 3, width: '400px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {modalEvent ? 'Edit Event' : 'Add New Event'}
          </Typography>

          <TextField
            label="Event Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Start Date"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={start}
            onChange={e => setStart(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="End Date"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={end}
            onChange={e => setEnd(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleModalClose} sx={{ color: 'gray' }}>Cancel</Button>
            <Button onClick={handleFormSubmit} variant="contained" sx={{ backgroundColor: '#FF5722' }}>
              {modalEvent ? 'Save Changes' : 'Add Event'}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default SchoolCalendar;
