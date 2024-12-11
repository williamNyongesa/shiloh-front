import axios from 'axios';

const getEnrollments = async () => {
  try {
    const response = await axios.get('/api/enrollments');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
};
const createEnrollment = async (studentId, courses, phoneNumber, documentFile, enrollmentDate = null) => {
  try {
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('courses', courses);
    formData.append('phone_number', phoneNumber);
    if (enrollmentDate) {
      formData.append('enrollment_date', enrollmentDate);
    }
    formData.append('document_file', documentFile);  // Append the document file
    
    const response = await axios.post('/api/enrollments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // Make sure to set the content type for file uploads
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error creating enrollment:', error);
  }
};
const getCourses = async () => {
  try {
    const response = await axios.get('/api/enrollments/courses');
    console.log(response.data.courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};
const loginUser = async (username, password) => {
  try {
    const response = await axios.post('/api/users/login', {
      username: username,
      password: password,
    });
    
    // Assuming you store the token in localStorage or sessionStorage
    const { access_token, username: user, email, role } = response.data;
    
    localStorage.setItem('access_token', access_token);
    console.log(`Logged in as ${user} (${role})`);
  } catch (error) {
    console.error('Login error:', error);
  }
};
const createUser = async (email, username, role, password) => {
  try {
    const response = await axios.post('/api/users', {
      email,
      username,
      role,
      password,
    });
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
const submitQuiz = async (quizId, answers) => {
  try {
    const response = await axios.post('/api/quizzes/submit-quiz', {
      quizId,
      answers,  // Format: { "questionId1": "answer1", "questionId2": "answer2" }
    });
    console.log('Quiz Score:', response.data.score);
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
