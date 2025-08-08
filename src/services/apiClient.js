import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Use environment variable or fallback
    headers: {
        'Content-Type': 'application/json',
    },
});

// This function lets you set the token dynamically for all future requests
export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove the token if none is provided (e.g., on logout)
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export default apiClient;
