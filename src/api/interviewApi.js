import { aiApi } from './axios';

export const generateInterviewPrep = (data) =>
    aiApi.post('/api/interview-prep/generate', data);