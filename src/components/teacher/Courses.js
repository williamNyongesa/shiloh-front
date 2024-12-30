import React from 'react';
import { Container, Box, Card, CardContent, Typography, Avatar } from '@mui/material';

const sampleData = [
    { id: 1, name: 'John Doe', subject: 'Mathematics', avatar: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jane Smith', subject: 'Science', avatar: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Emily Johnson', subject: 'History', avatar: 'https://via.placeholder.com/150' },
];

const Courses = () => {
    return (
        <Container sx={{ flexGrow: 1, padding: 2 }}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between">
                {sampleData.map((teacher) => (
                    <Box key={teacher.id} sx={{ width: { xs: '100%', sm: '48%', md: '30%' }, marginBottom: 2 }}>
                        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Avatar src={teacher.avatar} sx={{ marginRight: 2 }} />
                            <CardContent>
                                <Typography variant="h6">{teacher.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {teacher.subject}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default Courses;
