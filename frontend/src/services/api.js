import axios from "axios";

// Use environment variable for API URL, fallback to Railway production URL
const API = axios.create({
  baseURL:  "https://projecttask-production.up.railway.app/api",
});

export default API;
