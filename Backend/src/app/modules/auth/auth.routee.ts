import { Router } from "express";
import { authControllers } from "./auth.contoller.js";
import { authMiddleware } from "./auth.midlleware.js";

const authRouter = Router();

const authController = new authControllers();

authRouter // Register a USER
  .route("/register")
  .post(authController.register.bind(authController));

authRouter.route("/login").post(authController.login.bind(authController)); // Login a USER

authRouter // Logout a USER
  .route("/logout")
  .post(authMiddleware, authController.logout.bind(authController));

authRouter // Generate new Access Token
  .route("/refresToken")
  .post(authMiddleware, authController.refreshToken.bind(authController));

authRouter // Update User Credentials
  .route("/updateDetails")
  .patch(authMiddleware, authController.updateUserDetails.bind(authController));

authRouter // get user data
  .route("/getMe/:id")
  .get(authMiddleware, authController.getUser.bind(authController));

authRouter // delete user
  .route("/delete/:id")
  .post(authMiddleware, authController.deleteUser.bind(authController));

export { authRouter };
