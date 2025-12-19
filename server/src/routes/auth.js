import { Router } from "express";
import { login, register, me, logout } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const r = Router();

r.post("/register", register);
r.post("/login", login);
r.get("/me", protect, me);
r.post("/logout", protect, logout);

export default r;