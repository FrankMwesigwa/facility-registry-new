import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "development"
        ? (process.env.REACT_APP_API_BASE_URL_DEV || "http://localhost:9000/api")
        : (process.env.REACT_APP_API_BASE_URL_PROD || "https://nhfr.health.go.ug/api");

const API = axios.create({
    baseURL,
});

export default API;