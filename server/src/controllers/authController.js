import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d"
  });

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    // Note: allowing role set during register is convenient for dev.
    const user = await User.create({ name, email, password, role: role || "USER" });
    const token = sign(user);
    res.cookie("token", token, cookieOpts).json({ user, token });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = sign(user);
    res.cookie("token", token, cookieOpts).json({ user, token });
  } catch (e) {
    next(e);
  }
};

export const me = async (req, res) => res.json({ user: req.user });

export const logout = async (req, res) => {
  res.clearCookie("token").json({ ok: true });
};