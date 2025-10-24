import axios from "axios";

const api = axios.create({
    baseURL: "https://fdj-backend-1.onrender.com", // ✅ ton backend Render
});

export default api;


