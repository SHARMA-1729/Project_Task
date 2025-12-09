import axios from "axios";

// Use environment variable for API URL, fallback to Railway production URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://projecttask-production.up.railway.app/api",
});

export default API;
