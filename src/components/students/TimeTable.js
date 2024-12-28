import { useEffect, useState } from 'react'
import { Container, Paper, Typography, Box } from '@mui/material';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

function ScheduleClass() {
    const [schedule, setSchedule] = useState({
        class_id: '',
        room_id: '',
        start_time: '',
        end_time: '',
        day_of_week: '',
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sampleData = Array.from({ length: 10 }, (_, index) => ({
        class_id: `101${index}`,
        room_id: `A${index + 1}`,
        start_time: `2023-10-01T08:00`,
        end_time: `2023-10-01T10:00`,
        day_of_week: daysOfWeek[index % daysOfWeek.length],
    }));

    useEffect(() => {
        // You can use this effect to set initial values or fetch data if needed
    }, []);

    const handleSchedule = () => {
        axios.post('http://localhost:5000/timetable', schedule)
            .then(response => {
                // Handle success
            })
            .catch(error => {
                // Handle error
            });
    };

    return (
        <Container>
            <TextField label="Class ID" value={schedule.class_id} onChange={(e) => setSchedule({ ...schedule, class_id: e.target.value })} />
            <TextField label="Room ID" value={schedule.room_id} onChange={(e) => setSchedule({ ...schedule, room_id: e.target.value })} />
            <TextField label="Start Time" type="datetime-local" value={schedule.start_time} onChange={(e) => setSchedule({ ...schedule, start_time: e.target.value })} />
            <TextField label="End Time" type="datetime-local" value={schedule.end_time} onChange={(e) => setSchedule({ ...schedule, end_time: e.target.value })} />
            <TextField label="Day of Week" value={schedule.day_of_week} onChange={(e) => setSchedule({ ...schedule, day_of_week: e.target.value })} />
            <Button onClick={handleSchedule}>Schedule Class</Button>
        </Container>
    );
}

export default ScheduleClass;

// Sample data for timetable
const timetableData = [
    { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Math', room: 'Room 101', teacher: 'Mr. Smith' },
    { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'English', room: 'Room 102', teacher: 'Ms. Johnson' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Biology', room: 'Room 103', teacher: 'Dr. Brown' },
    { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'History', room: 'Room 101', teacher: 'Mr. White' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM', subject: 'Chemistry', room: 'Room 102', teacher: 'Mrs. Green' },
    { day: 'Wednesday', time: '9:00 AM - 10:00 AM', subject: 'Physics', room: 'Room 104', teacher: 'Mr. Adams' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM', subject: 'Math', room: 'Room 101', teacher: 'Mr. Smith' },
    { day: 'Thursday', time: '9:00 AM - 10:00 AM', subject: 'Computer Science', room: 'Room 105', teacher: 'Ms. Lee' },
    { day: 'Thursday', time: '10:00 AM - 11:00 AM', subject: 'Art', room: 'Room 106', teacher: 'Mr. Clark' },
    { day: 'Friday', time: '9:00 AM - 10:00 AM', subject: 'Geography', room: 'Room 103', teacher: 'Mr. Harris' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM', subject: 'PE', room: 'Gym', teacher: 'Ms. Taylor' },
];

// Function to create a timetable grid
export const Timetable = () => {
    // Days of the week for column headers
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // Time slots for rows
    const timeSlots = ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'];

    // Generate timetable with the sample data
    const renderTimetable = () => {
        return timeSlots.map((timeSlot, index) => (
            <Box display="flex" key={index} mb={2} justifyContent="center" alignItems="center">
                <Box flex={1} p={2} height={150} display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ bgcolor: '#1976d2', color: 'white', border: '1px solid #ccc', borderRadius: '8px 0 0 8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h6" align="center">{timeSlot}</Typography>
                </Box>
                {daysOfWeek.map((day, dayIndex) => {
                    // Find the class for this time slot and day
                    const classData = timetableData.find(
                        (item) => item.day === day && item.time === timeSlot
                    );

                    return (
                        <Box key={dayIndex} flex={1} p={2} height={150} display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ bgcolor: classData ? '#f5f5f5' : '#e0e0e0', border: '1px solid #ccc', borderRadius: dayIndex === daysOfWeek.length - 1 ? '0 8px 8px 0' : '0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            {classData ? (
                                <>
                                    <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{classData.subject}</Typography>
                                    <Typography variant="body2" align="center" sx={{ color: '#555' }}>{classData.room}</Typography>
                                    <Typography variant="body2" align="center" sx={{ color: '#888' }}>{classData.teacher}</Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary" align="center">
                                    No Class
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>
        ));
    };

    return (
        <Container>
            <Box mt={4} mb={2}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Class Timetable
                </Typography>
                <Box display="flex" mb={2}>
                    <Box flex={1} p={2} textAlign="center" sx={{ bgcolor: '#1976d2', color: 'white', borderRadius: '8px 0 0 8px' }}>
                        <Typography variant="h6">Time</Typography>
                    </Box>
                    {daysOfWeek.map((day, index) => (
                        <Box key={index} flex={1} p={2} textAlign="center" sx={{ bgcolor: '#1976d2', color: 'white', borderRadius: index === daysOfWeek.length - 1 ? '0 8px 8px 0' : '0' }}>
                            <Typography variant="h6">{day}</Typography>
                        </Box>
                    ))}
                </Box>

                {renderTimetable()}
            </Box>
        </Container>
    );
};
