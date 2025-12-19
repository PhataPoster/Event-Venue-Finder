import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/me").then(({ data }) => setBookings(data));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">My bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b._id} className="rounded border p-3">
            <div className="font-medium">{b.venue?.name || "Venue"} — {new Date(b.start).toLocaleString()} → {new Date(b.end).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Status: {b.status} • Total: £{b.totalPrice}</div>
          </div>
        ))}
        {bookings.length === 0 && <div className="text-gray-600">No bookings yet.</div>}
      </div>
    </main>
  );
}