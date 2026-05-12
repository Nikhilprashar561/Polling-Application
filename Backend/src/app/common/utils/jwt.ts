import JWT from "jsonwebtoken";
import 'dotenv/config'
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
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw ApiError.notFound('ACCESS_TOKEN_SECRET is not defined');

  return JWT.sign({ ...payload }, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string ?? '15m',
  });
}

export function generateRefreshToken(payload: RefreshPayload): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw ApiError.notFound('REFRESH_TOKEN_SECRET is not defined');

  return JWT.sign({ ...payload }, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string ?? '7d',
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw ApiError.notFound('ACCESS_TOKEN_SECRET is not defined');

  return JWT.verify(token, secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw ApiError.notFound('REFRESH_TOKEN_SECRET is not defined');

  return JWT.verify(token, secret) as RefreshPayload;
}
