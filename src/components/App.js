import '../App.css'
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup'
import Admin from './admin/Admin'

function App() {
  return (
        <div>
          <Routes>
            <Route path="/" element={<h1>Welcome to Shiloh SMS APP</h1>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>

  );
}

export default App;
