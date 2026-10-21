// Base API URLs from environment variables
export const API_BASE_URLS = {
    USER_SERVICE: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081',
    TRACKER_SERVICE: import.meta.env.VITE_TRACKER_SERVICE_URL || 'http://localhost:8082',
    AI_SERVICE: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8083',
};

// Application tracking statuses
export const APPLICATION_STATUS = {
    APPLIED: 'APPLIED',
    INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
    OFFER_RECEIVED: 'OFFER_RECEIVED',
    REJECTED: 'REJECTED',
};

// Labels formatted for display
export const STATUS_LABELS = {
    APPLIED: 'Applied',
    INTERVIEW_SCHEDULED: 'Interview Scheduled',
    OFFER_RECEIVED: 'Offer Received',
    REJECTED: 'Rejected',
};

// Badge styling (Tailwind CSS classes)
export const STATUS_BADGE_STYLES = {
    APPLIED: 'bg-blue-100 text-blue-700',
    INTERVIEW_SCHEDULED: 'bg-yellow-100 text-yellow-700',
    OFFER_RECEIVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

// Chart hex colors (used in ProfilePage Recharts pie chart)
export const STATUS_CHART_COLORS = {
    APPLIED: '#3b82f6',
    INTERVIEW_SCHEDULED: '#f59e0b',
    OFFER_RECEIVED: '#10b981',
    REJECTED: '#ef4444',
};

// Difficulty styling for interview preparation questions
export const DIFFICULTY_COLORS = {
    EASY: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HARD: 'bg-red-100 text-red-700',
};

// Match score threshold styling helper
export const getScoreColorClass = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
};

export const getScoreBgClass = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
};