import express from "express";
import {
  createShow,
  getAllShows,
  getShowById,
} from "../controllers/show-controller.js";

const router = express.Router();

// ➕ Add show
router.post("/", createShow);

// 📃 Get all shows
router.get("/", getAllShows);

// 🔍 Get single show
router.get("/:id", getShowById);

export default router;