import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // Importing the auth we set up

const Login = () => {
  const navigate = useNavigate();
  
  // State variables to hold user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setError(''); // Clear previous errors

    try {
      // 1. Send data to Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // 2. If successful, go to Dashboard
      console.log("Login Successful");
      navigate('/dashboard');
    } catch (err) {
      // 3. If failed, show error message
      console.error(err);
      setError("Failed to login. Check your email/password.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'Arial, sans-serif' }}>
      
      {/* LEFT SIDE: Login Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ width: '350px', padding: '40px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          <h1 style={{ marginBottom: '20px', color: '#333' }}>Login</h1>
          
          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="hello@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              required 
            />
            
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              required 
            />

            <button 
              type="submit" 
              style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Login
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
            New to BIM Platform? <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Placeholder Area */}
      <div style={{ flex: 1, backgroundColor: '#f4f4f4', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' }}>
        <h1 style={{ fontSize: '3rem', maxWidth: '400px', lineHeight: '1.2' }}>
            BIM Model <br/> Viewer Area
        </h1>
      </div>

    </div>
  );
};

export default Login;