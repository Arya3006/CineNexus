import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  movie: {
    type: String, // TMDB movie ID
    required: true,
  },
  movieTitle: {
  type: String,
},
  seats: {
    type: [String],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  amount: {               // ✅ REQUIRED FOR DASHBOARD
    type: Number,
    required: true,
  },
});

const Bookings = mongoose.model("Bookings", bookingSchema);

export default Bookings;