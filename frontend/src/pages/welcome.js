import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to Scrimtastic</h1>
      <p>Your Ultimate Varsity Scrimmage Data Viewer</p>
      
      <div className="button-container">
        <button 
          className="welcome-button login"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="welcome-button register"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Welcome;
