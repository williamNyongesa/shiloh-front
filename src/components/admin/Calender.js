import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Button, Modal, TextField, IconButton } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import CloseIcon from '@mui/icons-material/Close';

const SchoolCalendar = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalEvent, setModalEvent] = useState(null); // For new event or editing an event
  const [className, setClassName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Dummy event data
  const dummyEvents = [
    {
      id: 1,
      class_name: 'Math 101',
      room_number: 'A1',
      start_time: '2024-01-15T08:00:00',
      end_time: '2024-01-15T09:00:00',
    },
    {
      id: 2,
      class_name: 'History 202',
      room_number: 'B2',
      start_time: '2024-12-15T10:00:00',
      end_time: '2024-12-15T12:00:00',
    },
  ];

  // Fetch events or use dummy data
  useEffect(() => {
    // Transform dummy data to FullCalendar event format
    const transformedEvents = dummyEvents.map(event => ({
      id: event.id,
      title: `${event.class_name} (Room: ${event.room_number})`,
      start: event.start_time,
      end: event.end_time,
    }));
    setEvents(transformedEvents);
  }, []);

  // Open modal for adding or editing an event
  const handleOpenModal = (event = null) => {
    if (event) {
      setClassName(event.class_name);
      setRoomNumber(event.room_number);
      setStartTime(event.start_time);
      setEndTime(event.end_time);
      setModalEvent(event);
    } else {
      setClassName('');
      setRoomNumber('');
      setStartTime('');
      setEndTime('');
      setModalEvent(null);
    }
    setOpenModal(true);
  };

  // Handle form submission (Add or Edit event)
  const handleSaveEvent = () => {
    const newEvent = {
      id: modalEvent?.id || events.length + 1,
      class_name: className,
      room_number: roomNumber,
      start_time: startTime,
      end_time: endTime,
    };

    if (modalEvent) {
      setEvents(events.map((event) => (event.id === modalEvent.id ? newEvent : event)));
    } else {
      setEvents([...events, newEvent]);
    }

    handleCloseModal();
  };

  // Handle modal close without saving
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalEvent(null);
    setClassName('');
    setRoomNumber('');
    setStartTime('');
    setEndTime('');
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
            eventClick={info => handleOpenModal(info.event)}
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
          onClick={() => handleOpenModal()}  // Open modal to add a new event
        >
          Add New Event
        </Button>
      </Box>

      {/* Modal for adding/editing events */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ padding: 3, width: '400px' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {modalEvent ? 'Edit Event' : 'Add New Event'}
          </Typography>

          <TextField
            label="Class Name"
            variant="outlined"
            fullWidth
            value={className}
            onChange={e => setClassName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Room Number"
            variant="outlined"
            fullWidth
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Start Time"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="End Time"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCloseModal} sx={{ color: 'gray' }}>Cancel</Button>
            <Button onClick={handleSaveEvent} variant="contained" sx={{ backgroundColor: '#FF5722' }}>
              {modalEvent ? 'Save Changes' : 'Add Event'}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default SchoolCalendar;
