import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [capacity, setCapacity] = useState(params.get("capacity") || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const p = new URLSearchParams({
          ...(q && { q }),
          ...(city && { city }),
          ...(capacity && { capacity })
        });
        navigate(`/search?${p.toString()}`);
      }}
      className="flex w-full gap-2 rounded-xl bg-white p-2 shadow"
    >
      <input className="flex-1 rounded border px-3 py-2" placeholder="Search venues" value={q} onChange={(e) => setQ(e.target.value)} />
      <input className="w-40 rounded border px-3 py-2" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <input className="w-32 rounded border px-3 py-2" placeholder="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      <button className="rounded bg-black px-4 py-2 text-white">Search</button>
    </form>
  );
}