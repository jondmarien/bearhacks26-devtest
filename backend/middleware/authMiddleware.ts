import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies?.token;

  // Check Authorization header (Bearer token)
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Not authenticated, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.SESSION_SECRET || "default_secret",
    ) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Not authenticated, token invalid" });
    return;
  }
};

export default authMiddleware;
