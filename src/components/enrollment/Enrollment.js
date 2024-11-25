import React, { useState, useEffect } from "react";
import "./enrollment.css";

const Enrollment = () => {
  const [courses, setCourses] = useState([]); // State to store courses
  const [loading, setLoading] = useState(true); // Loading state
  const [formData, setFormData] = useState({
    studentId: "",
    phoneNumber: "",
    selectedCourses: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/enrollments/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched courses:", data); // Debugging
        setCourses(data.courses || []); // Safely handle missing data
      } catch (error) {
        console.error("Error fetching courses:", error); // Debugging
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    // Send form data to the backend API
    try {
      const response = await fetch("http://127.0.0.1:5000/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Enrollment success:", result);

      // Optionally, reset form after successful submission
      setFormData({
        studentId: "",
        phoneNumber: "",
        selectedCourses: [],
      });
      alert("Enrollment successful!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Error during enrollment. Please try again.");
    }
  };

  return (
    <div>
      <h1>Student Enrollment Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="studentId">Student ID:</label>
        <input
          type="number"
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleInputChange}
          required
        />
        <br />
        <br />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
        <br />
        <br />

        <label htmlFor="courses">Select Courses:</label>
        <select
          id="courses"
          name="selectedCourses"
          multiple
          value={formData.selectedCourses}
          onChange={(e) =>
            setFormData({
              ...formData,
              selectedCourses: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          required
        >
          {loading ? (
            <option value="" disabled>
              Loading courses...
            </option>
          ) : (
            courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))
          )}
        </select>
        <br />
        <br />

        <button type="submit">Enroll</button>
      </form>
    </div>
  );
};

export default Enrollment;
