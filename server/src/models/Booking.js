import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true, index: true },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    totalPrice: Number,
    paymentIntentId: String
  },
  { timestamps: true }
);

bookingSchema.index({ venue: 1, start: 1, end: 1 });

export default mongoose.model("Booking", bookingSchema);