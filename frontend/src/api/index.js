import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true
});

export const testConnection = async () => {
    try {
        const response = await API.get('/health-check/');
        return response.data;
    } catch (error) {
        console.error('API Connection Error:', error);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    const response = await API.post('/login/', { username, password });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await API.post('/register/', userData);
    return response.data;
};

export const testDB = async () => {
    const response = await API.get('/test-db/');
    return response.data;
}; 