import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Button, Typography, Box, Skeleton, IconButton, Modal, Grid, Avatar } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  Paper } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { getDemoUser } from '../../demoData';
import { Assessment, CheckCircle, Search, TrendingUp } from '@mui/icons-material';

const Grading = () => {
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradeId, setGradeId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const demoStudents = getDemoUser('teacher').teacher.students.map((student) => ({
        ...student,
        first_name: student.student_name.split(' ')[0],
        last_name: student.student_name.split(' ').slice(1).join(' '),
        student_id: `SHL-${student.id}`,
    }));

    const fetchStudents = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem('userDATA') || 'null');
            if (storedData?.demo) {
                setStudents(demoStudents);
                return;
            }
            const response = await axios.get('https://shiloh-server-2t51.onrender.com/students');
            setStudents(response.data);
            console.log('Students:', response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchGrades = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem('userDATA') || 'null');
            if (storedData?.demo) {
                setGrades(demoStudents.map((student, index) => ({ id: index + 1, student_id: student.id, course: student.course, grade: [87, 74, 92][index] })));
                setLoading(false);
                return;
            }
            const response = await axios.get('https://shiloh-server-2t51.onrender.com/grades');
            setGrades(response.data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchGrades();
    }, []);

    const formik = useFormik({
        initialValues: {
            id: '',
            student_id: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            course: '',
            grade: '',
        },
        validationSchema: Yup.object({
            id: Yup.string().required('ID is required'),
            student_id: Yup.string().required('Student ID is required'),
            course: Yup.string().required('Course is required'),
            grade: Yup.number().required('Grade is required').min(0, 'Grade must be at least 0').max(100, 'Grade must be at most 100'),
        }),
        onSubmit: async (values) => {
            // Prepare the object to only submit the required fields
            const dataToSubmit = {
                course: values.course,
                grade: values.grade,
                student_id: values.id,
            };
    
            try {
                if (gradeId) {
                    // Update grade (PUT request)
                    const response = await axios.put(`https://shiloh-server-2t51.onrender.com/grades/${gradeId}`, dataToSubmit);
                    console.log('Grade updated:', response.data);
                } else {
                    // Create new grade (POST request)
                    const response = await axios.post('https://shiloh-server-2t51.onrender.com/grades', dataToSubmit);
                    console.log('Grade created:', response.data);
                }
                fetchGrades();
                setOpenModal(false);  // Close modal after submission
            } catch (error) {
                console.error('Error submitting grade:', error);
            }
        },
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://shiloh-server-2t51.onrender.com/grades/${id}`);
            await axios.delete(`https://shiloh-server-2t51.onrender.com/grades/${id}`);
            fetchGrades();
        } catch (error) {
            console.error('Error deleting grade:', error);
        }
    };

    const handleEdit = (grade) => {
        setGradeId(grade.id);
        formik.setValues({
            id: grade.id,
            student_id: grade.student_id,
            course: grade.course,
            grade: grade.grade,
        });
        setOpenModal(true);  // Open modal to edit grade
    };

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        formik.setFieldValue('id', student.id);
        formik.setFieldValue('student_id', student.student_id);
        formik.setFieldValue('first_name', student.first_name || '');
        formik.setFieldValue('middle_name', student.middle_name || '');
        formik.setFieldValue('last_name', student.last_name || '');
        setOpenModal(true);  // Open modal for grading
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedStudent(null);
        formik.resetForm();  // Reset the form
    };

    const visibleStudents = students.filter((student) => `${student.first_name || ''} ${student.last_name || ''} ${student.student_id || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const averageGrade = grades.length ? Math.round(grades.reduce((sum, grade) => sum + Number(grade.grade || 0), 0) / grades.length) : 0;

    return (
        <Container className="teacher-grading-page" maxWidth="lg">
            <Box className="teacher-page-heading"><Box><Typography className="eyebrow">ASSESSMENT CENTER</Typography><Typography variant="h4" sx={{ mt: .5 }}>Student grading</Typography><Typography color="text.secondary" sx={{ mt: .75 }}>Give timely feedback and keep every learner&apos;s progress visible.</Typography></Box><Button variant="contained" startIcon={<Assessment />} onClick={() => setOpenModal(true)}>Add grade</Button></Box>
            <Box className="grading-stat-grid"><Paper elevation={0}><Avatar><Assessment /></Avatar><Box><Typography variant="h5">{students.length}</Typography><Typography variant="body2" color="text.secondary">Learners in view</Typography></Box></Paper><Paper elevation={0}><Avatar><TrendingUp /></Avatar><Box><Typography variant="h5">{averageGrade}%</Typography><Typography variant="body2" color="text.secondary">Average grade</Typography></Box></Paper><Paper elevation={0}><Avatar><CheckCircle /></Avatar><Box><Typography variant="h5">{grades.length}</Typography><Typography variant="body2" color="text.secondary">Grades recorded</Typography></Box></Paper></Box>

                <Box sx={{ mt: 4 }}>
                    <Box className="grading-toolbar"><Typography variant="h6">Learners awaiting feedback</Typography><TextField size="small" placeholder="Search learners..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} InputProps={{ startAdornment: <Search color="action" sx={{ mr: 1 }} /> }} /></Box>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={118} />
                    ) : (
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'gray' }}>First Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'gray' }}>Middle Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'gray' }}>Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'gray' }}>Student ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'gray' }}>Actions</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {visibleStudents.map((student) => (
                                    <TableRow key={student.id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' }, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <TableCell>{student.first_name || 'N/A'}</TableCell>
                                    <TableCell>{student.middle_name || 'N/A'}</TableCell>
                                    <TableCell>{student.last_name || 'N/A'}</TableCell>
                                    <TableCell>{student.student_id}</TableCell>
                                    <TableCell>
                                        <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(student)}
                                        sx={{
                                            borderRadius: 2,
                                            paddingX: 3,
                                            '&:hover': {
                                            backgroundColor: '#3f51b5',
                                            },
                                        }}
                                        >
                                        Grade
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                    )}
                </Box>

            {/* Grading Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ width: 400, margin: 'auto', mt: 10, p: 3, backgroundColor: 'white' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Grade {selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.middle_name} ${selectedStudent.last_name}` : ''}
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                    <TextField
                            fullWidth
                            id="id"
                            name="student_id"
                            label="Student ID"
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helperText={formik.touched.id && formik.errors.id}
                            margin="normal"
                            disabled
                        />
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
                            disabled
                        />
                        <TextField
                            fullWidth
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                            helperText={formik.touched.first_name && formik.errors.first_name}
                            margin="normal"
                            disabled
                        />
                        <TextField
                            fullWidth
                            id="middle_name"
                            name="middle_name"
                            label="Middle Name"
                            value={formik.values.middle_name}
                            onChange={formik.handleChange}
                            error={formik.touched.middle_name && Boolean(formik.errors.middle_name)}
                            helperText={formik.touched.middle_name && formik.errors.middle_name}
                            margin="normal"
                            disabled
                        />
                        <TextField
                            fullWidth
                            id="last_name"
                            name="last_name"
                            label="Last Name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                            helperText={formik.touched.last_name && formik.errors.last_name}
                            margin="normal"
                            disabled
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
                            Submit
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Container>
    );
};

export default Grading;
