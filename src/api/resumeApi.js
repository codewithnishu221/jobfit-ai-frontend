import { userApi } from './axios';

export const uploadResume = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return userApi.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const getAllResumes = (page = 0, size = 10) =>
    userApi.get(`/api/resumes?page=${page}&size=${size}`);

export const getResumeById = (id) =>
    userApi.get(`/api/resumes/${id}`);

export const deleteResume = (id) =>
    userApi.delete(`/api/resumes/${id}`);