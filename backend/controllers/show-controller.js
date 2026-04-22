import Show from "../models/show.js"; // ✅ match your file name exactly
import Bookings from "../models/Bookings.js";

// ➕ CREATE SHOW
export const createShow = async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;

    // 🚫 prevent duplicate shows
    const existing = await Show.findOne({ movieId });

    if (existing) {
      return res.status(400).json({
        message: "Show already exists",
      });
    }

    const show = new Show({
      movieId,
      title,
      poster,
    });

    await show.save();

    res.status(201).json({
      success: true,
      show,
    });

  } catch (err) {
    console.error("CREATE SHOW ERROR:", err);
    res.status(500).json({ message: "Error creating show" });
  }
};


// 📃 GET ALL SHOWS (WITH STATS)
import axios from "axios";

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find();
    const bookings = await Bookings.find();

    const movieMap = {};

    // 1️⃣ Admin shows
    shows.forEach((show) => {
      movieMap[show.movieId] = {
        movieId: show.movieId,
        title: show.title,
        poster: show.poster,
        bookingsCount: 0,
        revenue: 0,
      };
    });

    // 2️⃣ Bookings
    for (const b of bookings) {
      if (!movieMap[b.movie]) {
        // 🔥 Fetch from TMDB
        try {
          const resTMDB = await axios.get(
            `https://api.themoviedb.org/3/movie/${b.movie}?api_key=${process.env.TMDB_API_KEY}`
          );

          movieMap[b.movie] = {
            movieId: b.movie,
            title: resTMDB.data.title,
            poster: `https://image.tmdb.org/t/p/w500${resTMDB.data.poster_path}`,
            bookingsCount: 0,
            revenue: 0,
          };
        } catch {
          movieMap[b.movie] = {
            movieId: b.movie,
            title: `Movie ${b.movie}`,
            poster: "",
            bookingsCount: 0,
            revenue: 0,
          };
        }
      }

      movieMap[b.movie].bookingsCount += 1;

      b.seats.forEach((seat) => {
        const row = seat[0];

        if (["A", "B"].includes(row)) movieMap[b.movie].revenue += 150;
        else if (["C", "D", "E", "F"].includes(row)) movieMap[b.movie].revenue += 200;
        else movieMap[b.movie].revenue += 300;
      });
    }

    res.json({ shows: Object.values(movieMap) });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shows" });
  }
};

// 🔍 GET SINGLE SHOW
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json({ show });

  } catch (err) {
    console.error("GET SHOW ERROR:", err);
    res.status(500).json({ message: "Error fetching show" });
  }
};