import type { Response, NextFunction } from "express";
import User from "../models/User";
import type { AuthRequest } from "./authMiddleware";

const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error checking admin status" });
  }
};

export default adminMiddleware;
