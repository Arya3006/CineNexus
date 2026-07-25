import axios from "axios";

export const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_URL,
});

// 🎬 SHOWS
export const getShows = () => API.get("/shows");
export const addShow = (data) => API.post("/shows", data);
export const getShowById = (id) => API.get(`/shows/${id}`);

// 🎟 BOOKINGS
export const getBookings = () => API.get("/booking");

// 🎥 MOVIES (optional)
export const getMovies = () => API.get("/movie");

export default API;