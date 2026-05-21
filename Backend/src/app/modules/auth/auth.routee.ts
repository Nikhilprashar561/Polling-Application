import { Router } from "express";
import { authControllers } from "./auth.contoller.js";
import { authMiddleware } from "./auth.midlleware.js";

const authRouter = Router();
const authController = new authControllers();

authRouter.route("/register").post(authController.register.bind(authController));
authRouter.route("/login").post(authController.login.bind(authController));
authRouter.route("/logout").post(authMiddleware, authController.logout.bind(authController));

// refreshToken reads from cookie, no auth middleware needed
authRouter.route("/refresToken").post(authController.refreshToken.bind(authController));

authRouter.route("/updateDetails").patch(authMiddleware, authController.updateUserDetails.bind(authController));
authRouter.route("/getMe/:id").get(authMiddleware, authController.getUser.bind(authController));
authRouter.route("/delete/:id").delete(authMiddleware, authController.deleteUser.bind(authController));

export { authRouter };
