import '../App.css'
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import Admin from './admin/Admin'
import StudentDashboard from './students/StudentDashboard';

function App() {
  return (
    <div>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/student" element={<StudentDashboard />} />
          </Routes>
        </div>

  );
}

export default App;
