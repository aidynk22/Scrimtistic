import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';
import { getTeamData, getTeamMatches } from '../api/index';

function HomePage() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [matches, setMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamId = localStorage.getItem('team_id');
        if (!teamId) {
          navigate('/login');
          return;
        }
        
        const teamData = await getTeamData(teamId);
        setTeamName(teamData.team_name);
        
        const matchesData = await getTeamMatches(teamId);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching team data:', error);
        if (error.response?.status === 404 || error.response?.status === 401) {
          localStorage.removeItem('team_id');
          navigate('/login');
        }
      }
    };
    fetchTeamData();
  }, [navigate]);

  useEffect(() => {
    // Filter and sort matches
    let filtered = [...matches];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.Game_Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.Match_Date) - new Date(a.Match_Date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.Match_Date) - new Date(b.Match_Date));
        break;
      case 'wins':
        filtered.sort((a, b) => (b.Result === 'WIN') - (a.Result === 'WIN'));
        break;
      case 'losses':
        filtered.sort((a, b) => (b.Result === 'LOSS') - (a.Result === 'LOSS'));
        break;
      default:
        break;
    }

    setFilteredMatches(filtered);
  }, [matches, searchTerm, sortOption]);

  const handleMatchClick = (matchId) => {
    navigate(`/match/${matchId}`);
  };

  return (
    <div className="home-container">
      <div className="team-profile">
        <h2>{teamName}</h2>
        <div className="match-controls">
          <input
            type="text"
            placeholder="Search by game title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="wins">Wins First</option>
            <option value="losses">Losses First</option>
          </select>
        </div>
      </div>

      <div className="matches-section">
        <h3>Match History ({filteredMatches.length} matches)</h3>
        <div className="matches-list">
          {filteredMatches.map((match) => (
            <div 
              key={match.Match_ID} 
              className="match-item"
              onClick={() => handleMatchClick(match.Match_ID)}
            >
              <div className="match-info">
                <div className="match-header">
                  <span className="game-title">{match.Game_Title}</span>
                  <span className={`match-result ${match.Result.toLowerCase()}`}>
                    {match.Result}
                  </span>
                </div>
                <div className="match-details">
                  <div className="match-date-time">
                    <span>Date: {match.Match_Date}</span>
                    <span>Time: {match.Match_Time}</span>
                  </div>
                  <div className="match-scores">
                    <span className="score">Score: {match.Team_Score} - {match.Enemy_Score}</span>
                    <span className="kda">Team KDA: {match.Total_Kills}/{match.Total_Deaths}/{match.Total_Assists}</span>
                  </div>
                  <div className="match-stats">
                    <span>First Bloods: {match.First_Bloods}</span>
                    <span>Total Playtime: {match.Total_Playtime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
