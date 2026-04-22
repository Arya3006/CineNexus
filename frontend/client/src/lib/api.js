import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
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