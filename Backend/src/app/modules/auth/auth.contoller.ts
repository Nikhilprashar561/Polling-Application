import type { Request, Response } from "express";

import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";

import {
  hashPassword,
  verifyPassword,
} from "../../common/utils/passwordCheck.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.js";
import { ApiError } from "../../common/utils/ApiError.js";

interface registerUser {
  email: string;
  password: string;
  fullName: string;
}

interface loginUser {
  email: string;
  password: string;
}

class authControllers {
  public async register(
    req: Request<{}, {}, registerUser>,
    res: Response,
  ): Promise<void> {
    // Register Process
    // 1. Get Deatails From Request Body
    // Fullname, email, password
    // 2. Validate Them all coming or not if any one missing return it
    // 3. Check First if User exists , if exists then return it with error
    // Hash User Normal Password
    // 4. If not then Create a New User and store into Database
    // 5. again check if user is create or not
    // 6. Return use with data and Proper response

    const { fullName, email, password } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      throw ApiError.badRequest("All fields are required");
    }

    const emailLowercase = email.toLowerCase().trim();

    const [userExist] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, emailLowercase));

    if (userExist)
      throw ApiError.conflict(`User Already Exists with this email ${email}`);

    const passwordHash = await hashPassword(password);

    const [create] = await db
      .insert(usersTable)
      .values({
        fullName: fullName.trim(),
        email: emailLowercase,
        password: passwordHash,
      })
      .returning({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        createdtAt: usersTable.createdAt,
      });

    if (!create) throw ApiError.internal("Failed to register user");

    ApiResponse.created(res, "User Created SuccessFully", create);
  }

  public async login(
    req: Request<{}, {}, loginUser>,
    res: Response,
  ): Promise<void> {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      throw ApiError.badRequest("Email and password are required");
    }

    const emailLowercase = email.toLowerCase().trim();

    const [user] = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        password: usersTable.password,
        refreshToken: usersTable.refreshToken,
      })
      .from(usersTable)
      .where(eq(usersTable.email, emailLowercase));

    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const isPasswordValid = await verifyPassword({
      oldPassword: password,
      hashPassword: user.password,
    });

    if (!isPasswordValid)
      throw ApiError.unauthorized("Invalid email or password");

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    const refreshToken = generateRefreshToken({ userId: user.id });

    await db
      .update(usersTable)
      .set({ refreshToken })
      .where(eq(usersTable.id, user.id));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Login successful", {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      accessToken,
    });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) throw ApiError.unauthorized("User not found");

    // Clear refresh token from database
    await db
      .update(usersTable)
      .set({ refreshToken: null })
      .where(eq(usersTable.id, userId));

    // Clear cookie
    res.clearCookie("refreshToken");

    ApiResponse.ok(res, "Logout successful", null);
  }

  public async updateUserDetails(
    req: Request<
      {},
      {},
      { email?: string; fullName?: string; password?: string }
    >,
    res: Response,
  ): Promise<void> {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) throw ApiError.unauthorized("User not found");

    const { email, fullName, password } = req.body;

    // At least one field must be provided
    if (!email?.trim() && !fullName?.trim() && !password?.trim()) {
      throw ApiError.badRequest("At least one field is required to update");
    }

    const [currentUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!currentUser) throw ApiError.notFound("User not found");

    if (email && email.toLowerCase().trim() !== currentUser.email) {
      const [emailExists] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase().trim()));

      if (emailExists) throw ApiError.conflict("Email already in use");
    }

    const updateData: any = {};

    if (email?.trim()) updateData.email = email.toLowerCase().trim();
    if (fullName?.trim()) updateData.fullName = fullName.trim();

    if (password?.trim()) {
      updateData.password = await hashPassword(password);
    }

    const [updated] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
      });

    if (!updated) throw ApiError.internal("Failed to update user details");

    ApiResponse.ok(res, "User details updated successfully", updated);
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshTokenFromCookie =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshTokenFromCookie)
      throw ApiError.unauthorized("Refresh token is missing");

    let decoded;

    try {
      decoded = verifyRefreshToken(refreshTokenFromCookie);
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
        refreshToken: usersTable.refreshToken,
      })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId));

    if (!user || user.refreshToken !== refreshTokenFromCookie) {
      throw ApiError.unauthorized("Refresh token is invalid or revoked");
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    ApiResponse.ok(res, "Access token refreshed successfully", {
      accessToken: newAccessToken,
    });
  }

  public async getUser(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    if (!id?.trim()) throw ApiError.badRequest("User ID is required");

    const [user] = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        avatar: usersTable.avatar,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) throw ApiError.notFound("User not found");

    ApiResponse.ok(res, "User retrieved successfully", user);
  }

  public async deleteUser(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    // @ts-ignore
    const authenticatedUserId = req.user?.userId;
    const { id } = req.params;

    if (!id?.trim()) throw ApiError.badRequest("User ID is required");

    if (authenticatedUserId !== id) {
      throw ApiError.forbidden("You can only delete your own account");
    }

    const [userExists] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!userExists) throw ApiError.notFound("User not found");

    await db.delete(usersTable).where(eq(usersTable.id, id));

    res.clearCookie("refreshToken");

    ApiResponse.ok(res, "User deleted successfully", null);
  }
}

export { authControllers };
