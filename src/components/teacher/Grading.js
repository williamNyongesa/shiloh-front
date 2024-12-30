import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Button, Typography, Box, Skeleton, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Grading = () => {
    const [gradeId, setGradeId] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGrades = async () => {
        try {
            const response = await axios.get('http://localhost:5000/grades');
            setGrades(response.data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    const formik = useFormik({
        initialValues: {
            student_id: '',
            course: '',
            grade: '',
        },
        validationSchema: Yup.object({
            student_id: Yup.string().required('Student ID is required'),
            course: Yup.string().required('Course is required'),
            grade: Yup.number().required('Grade is required').min(0, 'Grade must be at least 0').max(100, 'Grade must be at most 100'),
        }),
        onSubmit: async (values) => {
            try {
                if (gradeId) {
                    const response = await axios.put(`http://localhost:5000/grades/${gradeId}`, values);
                    console.log('Grade updated:', response.data);
                } else {
                    const response = await axios.post('http://localhost:5000/grades', values);
                    console.log('Grade created:', response.data);
                }
                fetchGrades();
            } catch (error) {
                console.error('Error submitting grade:', error);
            }
        },
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/grades/${id}`);
            fetchGrades();
        } catch (error) {
            console.error('Error deleting grade:', error);
        }
    };

    const handleEdit = (grade) => {
        setGradeId(grade.id);
        formik.setValues({
            student_id: grade.student_id,
            course: grade.course,
            grade: grade.grade,
        });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Grade Student
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="student_id"
                        name="student_id"
                        label="Student ID"
                        value={formik.values.student_id}
                        onChange={formik.handleChange}
                        error={formik.touched.student_id && Boolean(formik.errors.student_id)}
                        helperText={formik.touched.student_id && formik.errors.student_id}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        id="course"
                        name="course"
                        label="Course"
                        value={formik.values.course}
                        onChange={formik.handleChange}
                        error={formik.touched.course && Boolean(formik.errors.course)}
                        helperText={formik.touched.course && formik.errors.course}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        id="grade"
                        name="grade"
                        label="Grade"
                        type="number"
                        value={formik.values.grade}
                        onChange={formik.handleChange}
                        error={formik.touched.grade && Boolean(formik.errors.grade)}
                        helperText={formik.touched.grade && formik.errors.grade}
                        margin="normal"
                    />
                    <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                        {gradeId ? 'Update' : 'Submit'}
                    </Button>
                </form>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Grades List
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={118} />
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade) => (
                                    <tr key={grade.id}>
                                        <td>{grade.course}</td>
                                        <td>{grade.grade}</td>
                                        <td>
                                            <IconButton color="primary" onClick={() => handleEdit(grade)} sx={{ mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleDelete(grade.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Grading;