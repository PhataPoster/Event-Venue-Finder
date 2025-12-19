import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <main>
      <section className="relative isolate bg-[url('/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">Find and book the perfect venue</h1>
          <p className="max-w-2xl text-lg opacity-90">Search spaces for meetings, parties, productions, and more.</p>
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-semibold">Popular categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Meeting room", "Party", "Conference", "Photoshoot"].map((c) => (
            <a key={c} href={`/search?q=${encodeURIComponent(c)}`} className="rounded-lg border p-6 hover:shadow">
              {c}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}