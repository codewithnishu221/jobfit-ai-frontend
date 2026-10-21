import { userApi } from './axios';

export const register = (data) =>
    userApi.post('/api/users/register', data);

export const login = (data) =>
    userApi.post('/api/users/login', data);

export const getProfile = () =>
    userApi.get('/api/users/profile');