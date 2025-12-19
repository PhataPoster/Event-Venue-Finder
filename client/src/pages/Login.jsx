import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Login() {
  const [email, setEmail] = useState("host@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.ok) setError(res.error);
    else navigate("/");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white">{loading ? "..." : "Log in"}</button>
      </form>
      <div className="mt-3 text-sm">No account? <Link to="/register" className="underline">Register</Link></div>
    </main>
  );
}