import { aiApi } from './axios';

export const getMatchScore = (data) =>
    aiApi.post('/api/match/score', data);

export const generateResume = (data) =>
    aiApi.post('/api/match/generate-resume', data);