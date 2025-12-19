import { create } from "zustand";
import { api } from "../lib/api";

export const useAuth = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, loading: false, initialized: true });
    } catch {
      set({ user: null, loading: false, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      set({ user: data.user, loading: false });
      return { ok: true };
    } catch (e) {
      set({ loading: false });
      return { ok: false, error: e?.response?.data?.error || "Login failed" };
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/register", payload);
      set({ user: data.user, loading: false });
      return { ok: true };
    } catch (e) {
      set({ loading: false });
      return { ok: false, error: e?.response?.data?.error || "Register failed" };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    set({ user: null });
  }
}));