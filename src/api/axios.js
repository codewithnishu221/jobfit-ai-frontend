import axios from 'axios';

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const trackerApi = axios.create({
    baseURL: import.meta.env.VITE_TRACKER_SERVICE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const aiApi = axios.create({
    baseURL: import.meta.env.VITE_AI_SERVICE_URL,
    headers: { 'Content-Type': 'application/json' }
});


const addAuthToken = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};


const handleAuthError = (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

[userApi, trackerApi, aiApi].forEach(instance => {
    instance.interceptors.request.use(addAuthToken);
    instance.interceptors.response.use(
        response => response,
        handleAuthError
    );
});