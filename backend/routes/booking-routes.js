import express from "express";
import {
  deleteBooking,
  getBookingById,
  newBooking,
  getAllBookings, // ✅ added
} from "../controllers/booking-controller.js";

import { createOrder } from "../controllers/booking-controller.js";

const bookingsRouter = express.Router(); // ✅ MUST come first

// ✅ Routes
bookingsRouter.get("/", getAllBookings);
bookingsRouter.get("/:id", getBookingById);
bookingsRouter.post("/", newBooking);
bookingsRouter.post("/create-order", createOrder);
bookingsRouter.delete("/:id", deleteBooking);

export default bookingsRouter;