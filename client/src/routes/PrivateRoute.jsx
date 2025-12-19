import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
  const { user, loading, initialized, init } = useAuth();
  const loc = useLocation();

  useEffect(() => {
    if (!initialized) init();
  }, [initialized]);

  if (!initialized || loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}