import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/useAuth";

export default function Venue() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quote, setQuote] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/venues/${slug}`).then(({ data }) => setData(data));
  }, [slug]);

  const getQuote = async () => {
    try {
      const { data: q } = await api.post("/bookings/quote", { venueId: data.venue._id, start, end });
      setQuote(q);
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to get quote");
    }
  };

  const book = async () => {
    try {
      const { data: r } = await api.post("/bookings", { venueId: data.venue._id, start, end });
      alert("Booking created. Status: " + r.booking.status);
    } catch (e) {
      if (e?.response?.status === 401) alert("Please log in to book.");
      else alert(e?.response?.data?.error || "Booking failed");
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;
  const v = data.venue;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">{v.name}</h1>
      <div className="mt-3 text-gray-600">{v.city}, {v.country} • up to {v.capacity} ppl</div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {v.images?.map((img, i) => <img key={i} src={img.url} alt={img.alt || v.name} className="rounded" />)}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-2 text-xl font-semibold">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{v.description}</p>

          <h2 className="mt-6 mb-2 text-xl font-semibold">Reviews</h2>
          <div className="space-y-4">
            {data.reviews.map((r) => (
              <div key={r._id} className="rounded border p-3">
                <div className="font-medium">{r.user?.name || "User"} • ⭐ {r.rating}</div>
                <div className="text-gray-700">{r.comment}</div>
              </div>
            ))}
            {data.reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-lg font-semibold">£{v.pricePerHour}/hour</div>
          <div className="mt-2 flex flex-col gap-2">
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="rounded border px-3 py-2" />
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded border px-3 py-2" />
            <button onClick={getQuote} className="rounded bg-gray-900 px-4 py-2 text-white">Get quote</button>
            {quote && <div className="text-sm">Total: £{quote.totalPrice} ({quote.hours}h)</div>}
            <button onClick={book} disabled={!user} className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400">
              {user ? "Request to book" : "Log in to book"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}