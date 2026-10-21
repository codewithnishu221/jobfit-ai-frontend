import { trackerApi } from './axios';

export const createApplication = (data) =>
    trackerApi.post('/api/applications/create-application', data);

export const getAllApplications = (page = 0, size = 10) =>
    trackerApi.get(`/api/applications/all-applications?page=${page}&size=${size}`);

export const getApplicationById = (id) =>
    trackerApi.get(`/api/applications/${id}`);

export const updateStatus = (id, status, interviewDate) =>
    trackerApi.put(`/api/applications/${id}/status`, { status, interviewDate });

export const deleteApplication = (id) =>
    trackerApi.delete(`/api/applications/${id}`);

export const checkReuse = (jobDescription) =>
    trackerApi.post('/api/applications/check-reuse', { jobDescription });