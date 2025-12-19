import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css'; 

// Import Supabase and useEffect
import { supabase } from './supbaseClient.js';
import { useEffect } from 'react';

function App() {
  // --- PASTE IT HERE (Inside the function) ---
  useEffect(() => {
    console.log("Supabase connected:", supabase);
  }, []);
  // -------------------------------------------

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;