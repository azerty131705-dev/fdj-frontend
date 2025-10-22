import axios from "axios";

// Base URL : soit celle du backend Render, soit localhost si tu bosses en local
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000",
});

export default api;

