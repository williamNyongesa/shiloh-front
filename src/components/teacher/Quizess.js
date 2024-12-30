import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Modal, Box, Typography, IconButton, Paper, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [openModal, setOpenModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState({ title: '', questions: [{ text: '', options: [''] }] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleTokenRefresh = async () => {
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post('http://localhost:5000/users/refresh', { token: refreshToken });
                    localStorage.setItem('access_token', response.data.access_token);
                    setToken(response.data.access_token);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        };

        const interval = setInterval(handleTokenRefresh, 15 * 60 * 1000); // Refresh token every 15 minutes
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/quizzes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizzes(response.data.quizzes);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [token]);

    const checkTokenExpiration = async () => {
        const tokenExpiration = JSON.parse(localStorage.getItem('tokenExpiration'));
        const now = new Date().getTime();

        if (tokenExpiration && now >= tokenExpiration) {
            await refreshToken();
        }
    };

    const refreshToken = async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            const response = await axios.post('http://localhost:5000/users/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${refresh_token}`
                }
            });

            if (response.status === 200) {
                const newToken = response.data.access_token;
                localStorage.setItem('access_token', newToken);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('tokenExpiration', JSON.stringify(new Date().getTime() + 60 * 60 * 1000)); // Assuming token is valid for 1 hour
                setToken(newToken);
                return newToken;
            } else {
                console.error("Error refreshing token", response.statusText);
            }
        } catch (error) {
            console.error("Error refreshing token", error);
        }
    };

    const handleOpenModal = (quiz) => {
        setEditingQuiz(quiz || { title: '', questions: [{ text: '', options: [''] }] });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingQuiz({ title: '', questions: [{ text: '', options: [''] }] });
    };

    const quizSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        questions: Yup.array().of(
            Yup.object().shape({
                text: Yup.string().required('Question text is required'),
                options: Yup.array().of(Yup.string().required('Option is required')).min(1, 'At least one option is required')
            })
        )
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await checkTokenExpiration();
            const quiz = {
                ...values,
                questions: values.questions.map(question => ({
                    ...question,
                    options: question.options.filter(option => option.trim() !== '')
                }))
            };
            if (quiz.id) {
                const updatedQuiz = await updateQuiz(quiz);
                setQuizzes(quizzes.map(q => (q.id === updatedQuiz.id ? updatedQuiz : q)));
            } else {
                const newQuiz = await createQuiz(quiz);
                setQuizzes([...quizzes, newQuiz]);
            }
            setOpenModal(false);
            setEditingQuiz({ title: '', questions: [{ text: '', options: [''] }] });
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const createQuiz = async (quiz) => {
        try {
            const response = await axios.post('http://localhost:5000/quizzes', quiz, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    const updateQuiz = async (quiz) => {
        try {
            const response = await axios.put(`http://localhost:5000/quizzes/${quiz.id}`, quiz, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => handleOpenModal({ title: '', questions: [{ text: '', options: [''] }] })}>
                Add New Quiz
            </Button>
            <Box display="flex" flexWrap="wrap" justifyContent="space-around" mt={2}>
                {loading ? (
                    <Skeleton variant="rectangular" width={300} height={200} />
                ) : (
                    quizzes.map((quiz) => (
                        <Box key={quiz.id} p={2} m={1} component={Paper} elevation={3} width={300}>
                            <Typography variant="h6">{quiz.title}</Typography>
                            {quiz.questions?.map((question, qIndex) => (
                                <Box key={qIndex} mt={1}>
                                    <Typography variant="subtitle1">{`Q${qIndex + 1}: ${question.text}`}</Typography>
                                    {question.options?.map((option, oIndex) => (
                                        <Typography key={oIndex} variant="body2">{`Option ${oIndex + 1}: ${option}`}</Typography>
                                    ))}
                                </Box>
                            ))}
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<EditIcon />}
                                onClick={() => handleOpenModal(quiz)}
                            >
                                Edit
                            </Button>
                        </Box>
                    ))
                )}
            </Box>

            <Modal open={openModal} onClose={handleCloseModal} sx={{padding:'50px'}}>
                <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto', backgroundColor: 'white', borderRadius: 2, maxHeight: '80vh', overflowY: 'auto' }}>
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        {editingQuiz?.id ? 'Edit Quiz' : 'Add New Quiz'}
                    </Typography>
                    <Formik
                        initialValues={editingQuiz}
                        validationSchema={quizSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, isSubmitting }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    label="Quiz Title"
                                    name="title"
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                />
                                <FieldArray name="questions">
                                    {({ push }) => (
                                        <div>
                                            {values.questions.map((question, qIndex) => (
                                                <Box key={qIndex} sx={{ marginBottom: 2 }}>
                                                    <Field
                                                        as={TextField}
                                                        label={`Question ${qIndex + 1}`}
                                                        name={`questions.${qIndex}.text`}
                                                        fullWidth
                                                        sx={{ marginBottom: 1 }}
                                                    />
                                                    <FieldArray name={`questions.${qIndex}.options`}>
                                                        {({ push }) => (
                                                            <div>
                                                                {question.options && question.options.map((option, oIndex) => (
                                                                    <Field
                                                                        key={oIndex}
                                                                        as={TextField}
                                                                        label={`Option ${oIndex + 1}`}
                                                                        name={`questions.${qIndex}.options.${oIndex}`}
                                                                        fullWidth
                                                                        sx={{ marginBottom: 1 }}
                                                                    />
                                                                ))}
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => push('')}
                                                                    sx={{ marginBottom: 1 }}
                                                                >
                                                                    Add Option
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => push({ text: '', options: [''] })}
                                                        sx={{ marginBottom: 1 }}
                                                    >
                                                        Add Question
                                                    </Button>
                                                </Box>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {editingQuiz?.id ? 'Save Changes' : 'Add Quiz'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </div>
    );
};

export default Quizzes;
