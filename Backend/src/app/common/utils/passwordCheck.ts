import bcrypt from "bcryptjs";
import { ApiError } from "./ApiError.js";

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw ApiError.badRequest("Password is missing");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

interface verifyPassword {
  oldPassword: string;
  hashPassword: string;
}

export async function verifyPassword({
  oldPassword,
  hashPassword,
}: verifyPassword): Promise<boolean> {
  if (!oldPassword || !hashPassword) {
    throw ApiError.badRequest("Password is missing");
  }

  const passwordCorrect = await bcrypt.compare(oldPassword, hashPassword);

  if (!passwordCorrect) {
    throw ApiError.unauthorized("Password is Wrong");
  }

  return passwordCorrect;
}
