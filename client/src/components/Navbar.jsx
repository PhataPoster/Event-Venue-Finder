import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../store/useAuth";

export default function Navbar() {
  const { user, init, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">VenueHub</Link>
        <div className="flex items-center gap-4">
          <Link to="/search" className={loc.pathname === "/search" ? "font-semibold" : ""}>Search</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={async () => { await logout(); navigate("/"); }} className="rounded bg-black px-3 py-1.5 text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="rounded bg-black px-3 py-1.5 text-white">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}