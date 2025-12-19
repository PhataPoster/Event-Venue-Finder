import mongoose from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";

const addressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    postcode: String,
    city: String,
    country: String
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: String,
    alt: String
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: String,
    capacity: Number,
    pricePerHour: Number,
    city: String,
    country: String,
    address: addressSchema,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" } // [lng, lat]
    },
    images: [imageSchema],
    amenities: [String], // e.g., ["wifi","projector"]
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

venueSchema.index({ name: "text", description: "text", city: "text" });

venueSchema.pre("save", function (next) {
  if (!this.slug) {
    const base = slugify(this.name, { lower: true, strict: true });
    this.slug = `${base}-${nanoid(6)}`;
  }
  next();
});

export default mongoose.model("Venue", venueSchema);