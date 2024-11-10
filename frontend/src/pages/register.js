import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import './register.css';
import '../styles/shared.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    player_ign: '',
    name: '',
    role: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        player_ign: formData.player_ign,
        name: formData.name,
        role: formData.role
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
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          autoComplete="username"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          autoComplete="new-password"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          autoComplete="email"
          required
        />
        <input
          type="text"
          placeholder="Player IGN"
          value={formData.player_ign}
          onChange={(e) => setFormData({...formData, player_ign: e.target.value})}
          autoComplete="off"
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          required
        />
        <button type="submit">Register</button>
      </form>
      <button className="back-button" onClick={() => navigate('/welcome')}>
        Back to Welcome
      </button>
    </div>
  );
}

export default Register;
