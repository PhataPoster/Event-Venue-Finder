import Venue from "../models/Venue.js";
import Review from "../models/Review.js";

export const createVenue = async (req, res, next) => {
  try {
    const v = await Venue.create({ ...req.body, owner: req.user._id });
    res.status(201).json(v);
  } catch (e) {
    next(e);
  }
};

// GET /api/venues?q=&city=&capacity=&min=&max=&amenities=a,b&lat=&lng=&dist=&sort=
export const listVenues = async (req, res, next) => {
  try {
    const { q, city, capacity, min, max, amenities, lat, lng, dist, sort } = req.query;

    const filter = {};
    if (city) filter.city = new RegExp(`^${city}$`, "i");
    if (capacity) filter.capacity = { $gte: Number(capacity) };
    if (min || max) filter.pricePerHour = { ...(min ? { $gte: Number(min) } : {}), ...(max ? { $lte: Number(max) } : {}) };
    if (amenities) filter.amenities = { $all: amenities.split(",") };
    if (lat && lng && dist) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(dist)
        }
      };
    }
    if (q) filter.$text = { $search: q };

    const sortMap = {
      price_asc: { pricePerHour: 1 },
      price_desc: { pricePerHour: -1 },
      rating: { ratingAvg: -1 },
      newest: { createdAt: -1 }
    };

    const venues = await Venue.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .limit(30)
      .select("name slug city country capacity pricePerHour images ratingAvg ratingCount");

    res.json(venues);
  } catch (e) {
    next(e);
  }
};

export const getVenue = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const venue = await Venue.findOne({ slug }).populate("owner", "name");
    if (!venue) return res.status(404).json({ error: "Not found" });

    const reviews = await Review.find({ venue: venue._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ venue, reviews });
  } catch (e) {
    next(e);
  }
};

export const updateVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findOneAndUpdate({ _id: id, owner: req.user._id }, req.body, { new: true });
    if (!venue) return res.status(404).json({ error: "Not found or not owner" });
    res.json(venue);
  } catch (e) {
    next(e);
  }
};

export const deleteVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const v = await Venue.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!v) return res.status(404).json({ error: "Not found or not owner" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};