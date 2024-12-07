import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('team_id');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="sticky-header">
      <nav className="nav-links">
        <div className="left-links">
          <Link className="nav-link" to="/home">Home</Link>
          <Link className="nav-link" to="/addMatches">Add Matches</Link>
        </div>
        <div className="right-links">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header; 