import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Register() {
  const [name, setName] = useState("New User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Choose role USER or HOST (for demo). In production, don't allow direct role selection.
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ name, email, password, role });
    if (!res.ok) setError(res.error);
    else navigate("/");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="w-full rounded border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="HOST">Host (can add venues)</option>
        </select>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white">{loading ? "..." : "Sign up"}</button>
      </form>
      <div className="mt-3 text-sm">Have an account? <Link to="/login" className="underline">Log in</Link></div>
    </main>
  );
}