import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { createVenue, listVenues, getVenue, updateVenue, deleteVenue } from "../controllers/venueController.js";

const r = Router();

r.get("/", listVenues);
r.get("/:slug", getVenue);
r.post("/", protect, restrictTo("HOST", "ADMIN"), createVenue);
r.put("/:id", protect, restrictTo("HOST", "ADMIN"), updateVenue);
r.delete("/:id", protect, restrictTo("HOST", "ADMIN"), deleteVenue);

export default r;