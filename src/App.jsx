import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';      // <--- Change P to p
import Signup from './pages/Signup';    // <--- Change P to p
import Dashboard from './pages/Dashboard'; // <--- Change P to p
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 