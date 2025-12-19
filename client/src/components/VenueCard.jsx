import { Link } from "react-router-dom";

export default function VenueCard({ v }) {
  const img = v.images?.[0]?.url;
  return (
    <Link to={`/venues/${v.slug}`} className="block rounded-xl border hover:shadow-lg transition">
      <div className="aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-gray-100">
        {img && <img src={img} alt={v.name} className="h-full w-full object-cover" />}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{v.name}</h3>
          <div className="text-sm font-medium">£{v.pricePerHour}/h</div>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {v.city}, {v.country} • up to {v.capacity} ppl
        </div>
        {typeof v.ratingAvg === "number" && v.ratingCount > 0 ? (
          <div className="mt-1 text-sm">⭐ {v.ratingAvg.toFixed(1)} ({v.ratingCount})</div>
        ) : null}
      </div>
    </Link>
  );
}