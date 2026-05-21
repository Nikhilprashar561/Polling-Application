import { Router } from "express";
import { responsePollingController } from "./response.controllers.js";
import { authMiddleware, optionalAuthMiddleware } from "../auth/auth.midlleware.js";

const responseRouter = Router();
const responseControllers = new responsePollingController();

// Submit poll — optional auth (controller enforces auth if poll requiresAuth=true)
responseRouter
  .route("/submitPoll/:pollId")
  .post(
    optionalAuthMiddleware,
    responseControllers.submitFinalPoll.bind(responseControllers),
  );

responseRouter
  .route("/expirePoll/:pollId")
  .post(
    authMiddleware,
    responseControllers.creatorPollSubmit.bind(responseControllers),
  );

responseRouter
  .route("/results/:pollLink")
  .get(responseControllers.finalPollResult.bind(responseControllers));

responseRouter
  .route("/completedPolls")
  .get(
    authMiddleware,
    responseControllers.completedPolls.bind(responseControllers),
  );

responseRouter
  .route("/analytics/:pollId")
  .get(
    authMiddleware,
    responseControllers.getPollAnalytics.bind(responseControllers),
  );

export { responseRouter };
