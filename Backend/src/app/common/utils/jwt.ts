import JWT, { type Secret, type SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { ApiError } from "./ApiError.js";

interface JwtPayload {
  userId: string;
  email: string;
  fullName: string;
}

interface RefreshPayload {
  userId: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET!;

  if (!secret) {
    throw ApiError.notFound("ACCESS_TOKEN_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
  };

  return JWT.sign(payload, secret, options);
}

export function generateRefreshToken(
  payload: RefreshPayload
): string {
  const secret: Secret = process.env.REFRESH_TOKEN_SECRET!;

  if (!secret) {
    throw ApiError.notFound("REFRESH_TOKEN_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any
  };

  return JWT.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET!;

  if (!secret) {
    throw ApiError.notFound("ACCESS_TOKEN_SECRET is not defined");
  }

  return JWT.verify(token, secret) as JwtPayload;
}

export function verifyRefreshToken(
  token: string
): RefreshPayload {
  const secret: Secret = process.env.REFRESH_TOKEN_SECRET!;

  if (!secret) {
    throw ApiError.notFound("REFRESH_TOKEN_SECRET is not defined");
  }

  return JWT.verify(token, secret) as RefreshPayload;
}