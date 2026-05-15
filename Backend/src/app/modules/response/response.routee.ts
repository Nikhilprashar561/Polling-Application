import { Router } from "express";
import { responsePollingController } from "./response.controllers.js";
import { authMiddleware } from "../auth/auth.midlleware.js";

const responseRouter = Router();
const responseControllers = new responsePollingController();

responseRouter
  .route("/submitPoll:/pollId/:pollLink")
  .post(responseControllers.submitFinalPoll.bind(responseControllers));

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
  .get(responseControllers.completedPolls.bind(responseControllers));

responseRouter
  .route("/analytics/:pollId")
  .get(responseControllers.getPollAnalytics.bind(responseControllers));

export { responseRouter };
