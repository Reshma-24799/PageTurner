export const BOOK_STATUS = {
    WANT_TO_READ: 'Want to Read',
    CURRENTLY_READING: 'Currently Reading',
    COMPLETED: 'Completed',
};

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
    },
    BOOKS: '/books',
    SESSIONS: '/sessions',
    STATS: '/stats',
};

export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    PASSWORD_MISMATCH: 'Passwords do not match',
};