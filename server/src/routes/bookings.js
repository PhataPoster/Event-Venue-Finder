import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { createBooking, quoteBooking, myBookings, hostBookings } from "../controllers/bookingController.js";

const r = Router();

r.post("/quote", protect, quoteBooking);
r.post("/", protect, createBooking);
r.get("/me", protect, myBookings);
r.get("/host", protect, restrictTo("HOST", "ADMIN"), hostBookings);

export default r;