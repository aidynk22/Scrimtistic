import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';

function HomePage() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState(['Moba', 'FPS']);
  const [newGenre, setNewGenre] = useState('');

  const handleAddGenre = () => {
    if (newGenre.trim()) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre('');
    }
  };

  const handleDeleteGenre = (index) => {
    setGenres(genres.filter((_, i) => i !== index));
  };

  return (
    <div className="home-container">
      <div className="team-profile">
        <div className="profile-image">
          <div className="image-placeholder">
            <span>Upload Team Logo</span>
          </div>
        </div>
        <input 
          type="text" 
          className="team-name-input" 
          placeholder="Team Name" 
        />
      </div>

      <div className="genres-section">
        <div className="genres-header">
          <h3>Game Genres</h3>
          <div className="genre-input-group">
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Add new genre"
              className="genre-input"
            />
            <button 
              onClick={handleAddGenre}
              className="add-genre-btn"
            >
              Add Genre
            </button>
          </div>
        </div>

        <div className="genres-list">
          {genres.map((genre, index) => (
            <div key={index} className="genre-item">
              <span>{genre}</span>
              <button 
                onClick={() => handleDeleteGenre(index)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
