import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import VenueCard from "../components/VenueCard";

export default function Search() {
  const [params] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      const { data } = await api.get(`/venues?${params.toString()}`);
      setVenues(data);
      setLoading(false);
    };
    fetchVenues();
  }, [params]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Search results</h1>
      {loading ? (
        <div>Loading...</div>
      ) : venues.length === 0 ? (
        <div className="text-gray-600">No venues found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => <VenueCard key={v._id} v={v} />)}
        </div>
      )}
    </main>
  );
}