import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetails, updateMatchStatistics } from '../api/index.js';
import '../styles/shared.css';

function DisplayMatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const data = await getMatchDetails(matchId);
        console.log('Fetched match details:', data);
        
        setMatchDetails(data.match);
        setStatistics(data.statistics);
        setScreenshots(data.screenshots);
      } catch (error) {
        console.error('Error fetching match details:', error);
        alert('Failed to load match details');
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handleStatUpdate = (index, field, value) => {
    const updatedStats = [...statistics];
    updatedStats[index][field] = value;
    setStatistics(updatedStats);
  };

  const handleSave = async () => {
    try {
        await updateMatchStatistics(matchId, statistics);
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating statistics:', error);
        alert('Failed to save changes');
    }
  };

  return (
    <div className="match-details-container">
      {matchDetails && (
        <>
          <div className="match-header">
            <h2>Match Details</h2>
            <div className="match-info">
              <span>Date: {matchDetails.match_date}</span>
              <span>Time: {matchDetails.match_time}</span>
              <span>Game: {matchDetails.game.title}</span>
            </div>
          </div>

          <div className="statistics-section">
            <div className="statistics-header">
              <h3>Match Statistics</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="edit-btn"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="statistics-table">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>First Blood</th>
                    <th>Score</th>
                    <th>Kills</th>
                    <th>Deaths</th>
                    <th>Assists</th>
                    <th>Playtime</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr key={stat.Player_IGN}>
                      <td>{stat.Player_IGN}</td>
                      {isEditing ? (
                        <>
                          <td><input type="number" value={stat.Wins} onChange={e => handleStatUpdate(index, 'Wins', e.target.value)} /></td>
                          <td><input type="number" value={stat.Losses} onChange={e => handleStatUpdate(index, 'Losses', e.target.value)} /></td>
                          <td><input type="number" value={stat.First_Blood} onChange={e => handleStatUpdate(index, 'First_Blood', e.target.value)} /></td>
                          <td><input type="number" value={stat.Score} onChange={e => handleStatUpdate(index, 'Score', e.target.value)} /></td>
                          <td><input type="number" value={stat.Kills} onChange={e => handleStatUpdate(index, 'Kills', e.target.value)} /></td>
                          <td><input type="number" value={stat.Deaths} onChange={e => handleStatUpdate(index, 'Deaths', e.target.value)} /></td>
                          <td><input type="number" value={stat.Assists} onChange={e => handleStatUpdate(index, 'Assists', e.target.value)} /></td>
                          <td><input type="time" value={stat.Playtime} onChange={e => handleStatUpdate(index, 'Playtime', e.target.value)} /></td>
                        </>
                      ) : (
                        <>
                          <td>{stat.Wins}</td>
                          <td>{stat.Losses}</td>
                          <td>{stat.First_Blood}</td>
                          <td>{stat.Score}</td>
                          <td>{stat.Kills}</td>
                          <td>{stat.Deaths}</td>
                          <td>{stat.Assists}</td>
                          <td>{stat.Playtime}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="save-btn"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          <div className="screenshots-section">
            <h3>Match Screenshots</h3>
            <div className="screenshots-grid">
              {screenshots.map((screenshot, index) => (
                <div key={screenshot.id} className="screenshot-item">
                  <img 
                    src={screenshot.data} 
                    alt={`Match Screenshot ${index + 1}`} 
                  />
                  {screenshot.note && (
                    <p className="screenshot-note">{screenshot.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DisplayMatch;
