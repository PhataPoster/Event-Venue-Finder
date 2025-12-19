import Review from "../models/Review.js";
import Venue from "../models/Venue.js";
import Booking from "../models/Booking.js";

export const addReview = async (req, res, next) => {
  try {
    const { venueId } = req.params;
    const { rating, comment } = req.body;

    const hasBooking = await Booking.exists({
      user: req.user._id,
      venue: venueId,
      status: { $in: ["PENDING", "CONFIRMED"] }
    });
    if (!hasBooking) return res.status(400).json({ error: "Book the venue before reviewing" });

    const review = await Review.create({
      user: req.user._id,
      venue: venueId,
      rating,
      comment
    });

    const agg = await Review.aggregate([
      { $match: { venue: review.venue } },
      { $group: { _id: "$venue", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    const { avg, count } = agg[0] || { avg: 0, count: 0 };
    await Venue.findByIdAndUpdate(venueId, { ratingAvg: avg, ratingCount: count });

    res.status(201).json(review);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: "You already reviewed this venue" });
    next(e);
  }
};