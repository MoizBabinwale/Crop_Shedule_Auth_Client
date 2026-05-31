// src/config/baseURL.js

export const LOCAL_BASE_URL = "http://localhost:5000";

// LIVE / PRODUCTION BASE URL
export const LIVE_BASE_URL = "https://crop-shedule-server-auth.vercel.app";

// Choose which one to use (easy switching)
// export const BACKEND_BASE_URL = LOCAL_BASE_URL;
export const BACKEND_BASE_URL = LIVE_BASE_URL;

export const BASE_URL = `${BACKEND_BASE_URL}/api`;
