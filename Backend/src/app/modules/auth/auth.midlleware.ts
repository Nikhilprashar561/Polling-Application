import type { NextFunction, Request, Response } from "express";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../../common/utils/ApiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access Token Missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) throw ApiError.unauthorized("Invalid Access token");

    const decoded = verifyAccessToken(token);

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
      })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) throw ApiError.unauthorized("User not found");

    req.user = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    // Return 401 response directly instead of throwing (to avoid unhandled rejection in optional-auth flows)
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

// Optional auth — attaches user if token valid, but does NOT block request if missing/invalid
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(); // no token — that's ok
    }

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    const decoded = verifyAccessToken(token);

    const [user] = await db
      .select({ id: usersTable.id, email: usersTable.email, fullName: usersTable.fullName })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (user) {
      req.user = { userId: user.id, email: user.email, fullName: user.fullName };
    }
  } catch (_) {
    // ignore — optional auth
  }
  next();
}
