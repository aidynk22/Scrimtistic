import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, {
      email: credentials.email,
      password: credentials.password
    });
    if (response.data.team_id) {
      localStorage.setItem('team_id', response.data.team_id);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

export const getGames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error.response?.data || error.message);
    throw error;
  }
};

export const addMatch = async (matchData) => {
  try {
    console.log('Sending match data:', matchData);
    const response = await axios.post(`${API_BASE_URL}/matches/`, matchData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding match:', error.response?.data || error.message);
    throw error;
  }
};

export const getMatchDetails = async (matchId) => {
  const response = await axios.get(`${API_BASE_URL}/matches/${matchId}/`);
  return response.data;
};

export const updateMatchStatistics = async (matchId, statistics) => {
  const response = await axios.put(`${API_BASE_URL}/matches/${matchId}/statistics/`, statistics);
  return response.data;
};

export const getTeamData = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team data:', error.response?.data || error.message);
    throw error;
  }
};

export const getTeamMatches = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/matches/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team matches:', error.response?.data || error.message);
    throw error;
  }
}; 