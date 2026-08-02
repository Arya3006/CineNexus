import 'dotenv/config';

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";
import showRouter from "./routes/show-routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use("/shows", showRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Connected To Database And Server is running on port ${PORT}`)
    );
  })
  .catch((e) => console.log(e));
