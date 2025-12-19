import Booking from "../models/Booking.js";
import Venue from "../models/Venue.js";

const overlapQuery = (start, end) => ({
  start: { $lt: end },
  end: { $gt: start }
});

export const quoteBooking = async (req, res, next) => {
  try {
    const { venueId, start, end } = req.body;
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    const s = new Date(start), e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e <= s) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    const hours = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60)));
    const totalPrice = hours * (venue.pricePerHour || 0);

    res.json({ totalPrice, currency: "GBP", hours });
  } catch (e) {
    next(e);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { venueId, start, end } = req.body;
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    const s = new Date(start), e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e <= s) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    const conflict = await Booking.findOne({
      venue: venueId,
      status: { $ne: "CANCELLED" },
      ...overlapQuery(s, e)
    });

    if (conflict) return res.status(409).json({ error: "Time slot not available" });

    const hours = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60)));
    const totalPrice = hours * (venue.pricePerHour || 0);

    const booking = await Booking.create({
      user: req.user._id,
      venue: venueId,
      start: s,
      end: e,
      totalPrice,
      status: "PENDING"
    });

    res.status(201).json({ booking });
  } catch (e) {
    next(e);
  }
};

export const myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("venue", "name slug images");
    res.json(bookings);
  } catch (e) {
    next(e);
  }
};

export const hostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate({
      path: "venue",
      match: { owner: req.user._id },
      select: "name slug"
    });
    res.json(bookings.filter((b) => b.venue));
  } catch (e) {
    next(e);
  }
};