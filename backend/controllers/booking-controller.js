import Bookings from "../models/Bookings.js";
import axios from "axios";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// ✅ CREATE BOOKING
export const newBooking = async (req, res) => {
  try {
    const { movie, movieTitle, seats, date, user } = req.body;

    // 🚫 CHECK CLASH
    const existingBookings = await Bookings.find({
      movie,
      date,
      seats: { $in: seats },
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some seats already booked ❌",
      });
    }

    // 💰 CALCULATE AMOUNT
    let amount = 0;

    seats.forEach((seat) => {
      const row = seat[0];

      if (["A", "B"].includes(row)) amount += 150;
      else if (["C", "D", "E", "F"].includes(row)) amount += 200;
      else amount += 300;
    });

    const booking = new Bookings({
      movie,
      movieTitle,
      seats,
      date,
      user,
      amount, // ✅ STORE AMOUNT
    });

    await booking.save();

    res.status(201).json({
      success: true,
      booking,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
};


// ✅ GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find();

    const result = await Promise.all(
      bookings.map(async (b) => {
        let movieTitle = b.movieTitle;

// ✅ If missing → fetch once and SAVE
if (!movieTitle) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${b.movie}?api_key=${process.env.TMDB_API_KEY}`
    );
    const data = await response.json();

    movieTitle = data.title || `Movie ${b.movie}`;

    // 🔥 SAVE INTO DB (IMPORTANT)
    await Bookings.findByIdAndUpdate(b._id, {
      movieTitle,
    });

  } catch (err) {
    movieTitle = `Movie ${b.movie}`;
  }
}

        // 💰 FIX amount (old bookings)
        let amount = b.amount || 0;

        if (!amount) {
          b.seats.forEach((seat) => {
            const row = seat[0];

            if (["A", "B"].includes(row)) amount += 150;
            else if (["C", "D", "E", "F"].includes(row)) amount += 200;
            else amount += 300;
          });
        }

        return {
          ...b._doc,
          movieTitle,
          amount,
        };
      })
    );

    res.status(200).json({ bookings: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Bookings.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting booking" });
  }
};

// 🔍 GET BOOKING BY ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ booking });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching booking" });
  }
};