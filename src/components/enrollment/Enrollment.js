import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './enrollment.css'

const Enrollment = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [courses, setCourses] = useState("");

  const navigate = useNavigate(); // React Router's navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      phone_number: phoneNumber,
      enrollment_date: enrollmentDate,
      courses,
    };

    try {
      await axios.post("http://127.0.0.1:5000/enrollments", payload);
      alert("Enrollment created successfully!");
      navigate("/student"); // Navigate to success page
    } catch (error) {
      console.error("Error creating enrollment:", error);
      alert("Failed to create enrollment.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enrollment Form</h2>

      <label>Phone Number:</label>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />

      <label>Enrollment Date:</label>
      <input
        type="date"
        value={enrollmentDate}
        onChange={(e) => setEnrollmentDate(e.target.value)}
        required
      />

      <label>Courses:</label>
      <input
        type="text"
        value={courses}
        onChange={(e) => setCourses(e.target.value)}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default Enrollment;