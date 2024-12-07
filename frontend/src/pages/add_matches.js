import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGames, addMatch } from '../api/index.js';
import '../styles/shared.css';

function AddMatches() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [matchData, setMatchData] = useState({
    game_title: '',
    match_name: '',
    match_date: '',
    match_time: '',
    team_score: 0,
    enemy_score: 0,
    result: 'WIN',
    player_stats: [],
    screenshots: []
  });

  const [currentPlayerStat, setCurrentPlayerStat] = useState({
    player_ign: '',
    kills: 0,
    deaths: 0,
    assists: 0,
    first_blood: 0,
    playtime: '00:00'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentScreenshot, setCurrentScreenshot] = useState({
    file: null,
    note: ''
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchGames();
  }, []);

  const validatePlayerStats = () => {
    if (!currentPlayerStat.player_ign) {
      alert('Player IGN is required');
      return false;
    }
    if (currentPlayerStat.kills < 0 || currentPlayerStat.deaths < 0 || currentPlayerStat.assists < 0) {
      alert('Stats cannot be negative');
      return false;
    }
    return true;
  };

  const handleAddPlayerStat = () => {
    if (!validatePlayerStats()) return;
    
    setMatchData(prev => ({
      ...prev,
      player_stats: [...prev.player_stats, currentPlayerStat]
    }));
    setCurrentPlayerStat({
      player_ign: '',
      kills: 0,
      deaths: 0,
      assists: 0,
      first_blood: 0,
      playtime: '00:00'
    });
  };

  const handleRemovePlayerStat = (index) => {
    setMatchData(prev => ({
      ...prev,
      player_stats: prev.player_stats.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const team_id = localStorage.getItem('team_id');
    if (!team_id) {
      alert('Please log in again');
      navigate('/login');
      return;
    }

    try {
      if (matchData.player_stats.length === 0) {
        alert('Please add at least one player stat');
        return;
      }

      if (!matchData.game_title || !matchData.match_date || !matchData.match_time) {
        alert('Please fill in all required fields');
        return;
      }
      
      const response = await addMatch({
        ...matchData,
        team_id: team_id
      });
      
      if (response.match_id) {
        navigate(`/match/${response.match_id}`);
      } else {
        throw new Error('No match ID returned');
      }
    } catch (error) {
      console.error('Error creating match:', error.response?.data || error);
      alert(error.response?.data?.error || 'Failed to create match. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentScreenshot(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleAddScreenshot = () => {
    if (!currentScreenshot.file) {
      alert('Please select a screenshot');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      setMatchData(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, {
          data: base64Data,
          note: currentScreenshot.note
        }]
      }));
      setCurrentScreenshot({ file: null, note: '' });
    };
    reader.readAsDataURL(currentScreenshot.file);
  };

  const handleRemoveScreenshot = (index) => {
    setMatchData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="add-match-container">
      <h2>Add New Match</h2>
      <form onSubmit={handleSubmit}>
        <div className="match-basic-info">
          <div className="input-group">
            <label htmlFor="game-title">Game Title</label>
            <input
              id="game-title"
              type="text"
              placeholder="Enter game title"
              value={matchData.game_title}
              onChange={(e) => setMatchData({...matchData, game_title: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="match-name">Match Name (Optional)</label>
            <input
              id="match-name"
              type="text"
              placeholder="e.g., Semifinals vs Team X"
              value={matchData.match_name}
              onChange={(e) => setMatchData({...matchData, match_name: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label htmlFor="match-date">Match Date</label>
            <input
              id="match-date"
              type="date"
              value={matchData.match_date}
              onChange={(e) => setMatchData({...matchData, match_date: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="match-time">Match Time</label>
            <input
              id="match-time"
              type="time"
              value={matchData.match_time}
              onChange={(e) => setMatchData({...matchData, match_time: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="match-scores">
          <div className="input-group">
            <label htmlFor="team-score">Team Score</label>
            <input
              id="team-score"
              type="number"
              min="0"
              value={matchData.team_score}
              onChange={(e) => setMatchData({...matchData, team_score: parseInt(e.target.value)})}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="enemy-score">Enemy Score</label>
            <input
              id="enemy-score"
              type="number"
              min="0"
              value={matchData.enemy_score}
              onChange={(e) => setMatchData({...matchData, enemy_score: parseInt(e.target.value)})}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="match-result">Result</label>
            <select
              id="match-result"
              value={matchData.result}
              onChange={(e) => setMatchData({...matchData, result: e.target.value})}
              required
            >
              <option value="WIN">Win</option>
              <option value="LOSS">Loss</option>
              <option value="DRAW">Draw</option>
            </select>
          </div>
        </div>

        <div className="player-stats-section">
          <h3>Add Player Statistics</h3>
          <div className="player-stats-form">
            <div className="input-group">
              <label htmlFor="player-ign">Player IGN</label>
              <input
                id="player-ign"
                type="text"
                placeholder="In-game name"
                value={currentPlayerStat.player_ign}
                onChange={(e) => setCurrentPlayerStat({...currentPlayerStat, player_ign: e.target.value})}
              />
            </div>

            <div className="stats-grid">
              <div className="stats-column">
                <div className="input-group">
                  <label htmlFor="player-kills">Kills</label>
                  <input
                    id="player-kills"
                    type="number"
                    min="0"
                    value={currentPlayerStat.kills}
                    onChange={(e) => setCurrentPlayerStat({...currentPlayerStat, kills: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="player-deaths">Deaths</label>
                  <input
                    id="player-deaths"
                    type="number"
                    min="0"
                    value={currentPlayerStat.deaths}
                    onChange={(e) => setCurrentPlayerStat({...currentPlayerStat, deaths: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="stats-column">
                <div className="input-group">
                  <label htmlFor="player-assists">Assists</label>
                  <input
                    id="player-assists"
                    type="number"
                    min="0"
                    value={currentPlayerStat.assists}
                    onChange={(e) => setCurrentPlayerStat({...currentPlayerStat, assists: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="player-first-blood">First Bloods</label>
                  <input
                    id="player-first-blood"
                    type="number"
                    min="0"
                    value={currentPlayerStat.first_blood}
                    onChange={(e) => setCurrentPlayerStat({...currentPlayerStat, first_blood: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="player-playtime">Playtime</label>
              <input
                id="player-playtime"
                type="time"
                step="1"
                value={currentPlayerStat.playtime}
                onChange={(e) => setCurrentPlayerStat({...currentPlayerStat, playtime: e.target.value})}
              />
            </div>

            <button type="button" onClick={handleAddPlayerStat} className="add-player-btn">
              Add Player Stats
            </button>
          </div>
        </div>

        <div className="player-stats-list">
          <h3>Added Players</h3>
          {matchData.player_stats.map((stat, index) => (
            <div key={index} className="player-stat-item">
              <div className="player-stat-info">
                <strong>{stat.player_ign}</strong>
                <span>K/D/A: {stat.kills}/{stat.deaths}/{stat.assists}</span>
                <span>First Bloods: {stat.first_blood}</span>
                <span>Playtime: {stat.playtime}</span>
              </div>
              <button 
                type="button" 
                onClick={() => handleRemovePlayerStat(index)}
                className="remove-player-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="screenshots-section">
          <h3>Add Screenshots</h3>
          <div className="screenshot-upload-form">
            <div className="input-group">
              <label htmlFor="screenshot">Screenshot</label>
              <input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
              />
            </div>
            <div className="input-group">
              <label htmlFor="screenshot-note">Note</label>
              <textarea
                id="screenshot-note"
                placeholder="Add a note about this screenshot..."
                value={currentScreenshot.note}
                onChange={(e) => setCurrentScreenshot(prev => ({
                  ...prev,
                  note: e.target.value
                }))}
              />
            </div>
            <button 
              type="button" 
              onClick={handleAddScreenshot}
              className="add-screenshot-btn"
            >
              Add Screenshot
            </button>
          </div>

          <div className="screenshots-preview">
            {matchData.screenshots.map((screenshot, index) => (
              <div key={index} className="screenshot-item">
                <img 
                  src={`data:image/jpeg;base64,${screenshot.data}`} 
                  alt={`Screenshot ${index + 1}`} 
                />
                <p className="screenshot-note">{screenshot.note}</p>
                <button 
                  type="button"
                  onClick={() => handleRemoveScreenshot(index)}
                  className="remove-screenshot-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-match-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Match'}
        </button>
      </form>
    </div>
  );
}

export default AddMatches;
