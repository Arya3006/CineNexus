import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movieId: {
    type: Number, // TMDB movie id
    required: true,
  },
  title: String,
  poster: String,

  // 🎟️ Booked seats (permanent)
  occupiedSeats: {
    type: Map,
    of: String, // userId
    default: {},
  },

  // ⏳ Temporary locked seats (10 min)
  lockedSeats: [
    {
      seat: String,
      userId: String,
      expiresAt: Date,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Show = mongoose.model("Show", showSchema);

export default Show;