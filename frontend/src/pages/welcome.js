import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to Scrimtistic</h1>
      <p>Your Ultimate Varsity Scrimmage Logger</p>
      
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
