import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';       // Capital 'P' to match your folder
import Signup from './Pages/Signup';     // Capital 'P' to match your folder
import Dashboard from './pages/Dashboard'; // Capital 'P' to match your folder
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