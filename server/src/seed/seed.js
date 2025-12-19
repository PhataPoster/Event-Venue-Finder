import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Venue from "./models/Venue.js";

dotenv.config(); // reads server/.env

const run = async () => {
  try {
    // 1) Connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Optional: ensure indexes (unique/text) are in place
    await User.syncIndexes?.();
    await Venue.syncIndexes?.();

    // 2) Clear existing data (optional)
    await User.deleteMany({});
    await Venue.deleteMany({});

    // 3) Create a host user
    const host = await User.create({
      name: "Hosty Host",
      email: "host@example.com",
      password: "password123",
      role: "HOST",
    });

    // 4) Insert sample venues
    const sampleVenues = [
      {
        owner: host._id,
        name: "Shoreditch Loft",
        description: "A bright loft perfect for workshops and offsites.",
        capacity: 30,
        pricePerHour: 80,
        city: "London",
        country: "UK",
        address: { line1: "123 Brick Lane", city: "London", country: "UK", postcode: "E1 6RU" },
        location: { type: "Point", coordinates: [-0.071, 51.521] },
        images: [{ url: "https://picsum.photos/seed/loft/800/500", alt: "Loft" }],
        amenities: ["wifi", "projector", "whiteboard"],
      },
      {
        owner: host._id,
        name: "Rooftop Terrace",
        description: "Open-air terrace with skyline views.",
        capacity: 80,
        pricePerHour: 150,
        city: "London",
        country: "UK",
        address: { line1: "456 High St", city: "London", country: "UK", postcode: "SW1A 1AA" },
        location: { type: "Point", coordinates: [-0.1276, 51.5074] },
        images: [{ url: "https://picsum.photos/seed/roof/800/500", alt: "Rooftop" }],
        amenities: ["bar", "sound_system", "heating"],
      },
      {
        owner: host._id,
        name: "Studio White Space",
        description: "Clean photography studio with cyclorama.",
        capacity: 15,
        pricePerHour: 60,
        city: "Manchester",
        country: "UK",
        address: { line1: "1 Studio Rd", city: "Manchester", country: "UK", postcode: "M1 1AA" },
        location: { type: "Point", coordinates: [-2.2446, 53.4839] },
        images: [{ url: "https://picsum.photos/seed/studio/800/500", alt: "Studio" }],
        amenities: ["lighting", "backdrops", "wifi"],
      },
    ];

    await Venue.insertMany(sampleVenues);

    console.log("Seed complete.");
    console.log("Host login:", { email: "host@example.com", password: "password123" });
  } catch (e) {
    console.error("Seed error:", e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();