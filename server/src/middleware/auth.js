import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization || "";
    const token = req.cookies.token || bearer.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
  next();
};