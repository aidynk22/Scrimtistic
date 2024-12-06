import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import '../styles/shared.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    team_name: '',
    email: '',
    password: '',
    player: {
      ign: '',
      name: '',
      role: ''
    }
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        team_name: formData.team_name,
        email: formData.email,
        password: formData.password,
        player: {
          ign: formData.player.ign,
          name: formData.player.name,
          role: formData.player.role
        }
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register for Scrimtastic</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Team Information</h3>
          <input
            type="text"
            placeholder="Team Name"
            value={formData.team_name}
            onChange={(e) => setFormData({...formData, team_name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Team Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        <div className="form-section">
          <h3>Team Captain Information</h3>
          <input
            type="text"
            placeholder="In-Game Name (IGN)"
            value={formData.player.ign}
            onChange={(e) => setFormData({
              ...formData, 
              player: {...formData.player, ign: e.target.value}
            })}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.player.name}
            onChange={(e) => setFormData({
              ...formData, 
              player: {...formData.player, name: e.target.value}
            })}
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={formData.player.role}
            onChange={(e) => setFormData({
              ...formData, 
              player: {...formData.player, role: e.target.value}
            })}
            required
          />
        </div>
        <button type="submit">Register Team</button>
      </form>
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
    </div>
  );
}

export default Register;
