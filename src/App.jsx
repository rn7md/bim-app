import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';      
import Signup from './pages/Signup';   
import Dashboard from './pages/Dashboard'; 
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
 