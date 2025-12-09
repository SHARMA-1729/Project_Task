import axios from "axios";

// Use environment variable for API URL, fallback to localhost for dev
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default API;
