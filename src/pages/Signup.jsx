import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// CHANGE 1: We import Firebase now, not Supabase
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // CHANGE 2: This is the command to create a user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // CHANGE 3: We save the user's info to the Database (Firestore)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });

      console.log("Account Created:", user);
      alert("Account created successfully!");
      navigate('/dashboard'); 

    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'Arial, sans-serif' }}>
      
      {/* LEFT SIDE: Sign Up Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ width: '350px', padding: '40px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          <h1 style={{ marginBottom: '20px', color: '#333' }}>Create Account</h1>
          
          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
              placeholder="Create Password (6+ chars)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              required 
            />

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '12px', 
                backgroundColor: loading ? '#ccc' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
            Already have an account? <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>Login</Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Visual */}
      <div style={{ flex: 1, backgroundColor: '#f4f4f4', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' }}>
        <h1 style={{ fontSize: '3rem', maxWidth: '400px', lineHeight: '1.2' }}>
            Join the <br/> BIM Platform
        </h1>
      </div>

    </div>
  );
};

export default Signup;