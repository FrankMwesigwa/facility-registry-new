import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "development"
        ? (process.env.REACT_APP_API_BASE_URL_DEV || "http://localhost:9000/api")
        : (process.env.REACT_APP_API_BASE_URL_PROD || "https://nhfr.health.go.ug/api");

const API = axios.create({
    baseURL,
});

// Add a request interceptor to add Authorization header with token from localStorage
API.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default API;
