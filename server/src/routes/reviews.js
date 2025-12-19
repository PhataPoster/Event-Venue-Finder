import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { addReview } from "../controllers/reviewController.js";

const r = Router();

r.post("/:venueId", protect, addReview);

export default r;