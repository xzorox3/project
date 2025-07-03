// Get backend URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://fcihub.onrender.com";

// API endpoints configuration
export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        REGISTER_USER: "/auth/register-user",
        REGISTER_ADMIN: "/auth/register-admin",
        LOGIN_USER: "/auth/login-user",
        LOGIN_ADMIN: "/auth/login-admin",
        FORGOT_PASSWORD: "/auth/forgot-password",
        VERIFY_RESET_CODE: "/auth/verify-reset-code",
        RESET_PASSWORD: "/auth/reset-password"
    },

    // User profile endpoints
    USER: {
        PROFILE: "/user/profile",
        ADMIN_PROFILE: "/user/admin/profile"
    },

    // Major endpoints
    MAJOR: {
        CREATE: "/major",
        GET_ALL: "/major",
        GET_BY_ID: "/major"
    },

    // Level endpoints
    LEVEL: {
        CREATE: "/level",
        GET_ALL: "/level",
        GET_BY_ID: "/level"
    },

    // Sub Major endpoints
    SUB_MAJOR: {
        CREATE: "/sub-major",
        GET_ALL: "/sub-major",
        GET_BY_ID: "/sub-major"
    },

    // Course endpoints
    COURSE: {
        CREATE: "/course",
        GET_ALL: "/course",
        GET_BY_ID: "/course"
    },

    // Event endpoints
    EVENT: {
        CREATE: "/event",
        GET_ALL: "/event",
        GET_BY_ID: "/event",
        DELETE: "/event"
    },

    // Lecture Time endpoints
    LECTURE_TIME: {
        CREATE: "/lecture-time",
        GET_ALL: "/lecture-time",
        GET_BY_ID: "/lecture-time",
        UPDATE: "/lecture-time",
        DELETE: "/lecture-time"
    }
};