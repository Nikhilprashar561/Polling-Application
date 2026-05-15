import { Router } from "express";
import { pollingContoller } from "./polling.controllers.js";
import { authMiddleware } from "../auth/auth.midlleware.js";

const pollingRouter = Router();
const pollingContollers = new pollingContoller();

pollingRouter
  .route("/createPoll")
  .post(authMiddleware, pollingContollers.createPoll.bind(pollingContollers));

pollingRouter
  .route("/createQuestion/:pollId")
  .post(
    authMiddleware,
    pollingContollers.createQuestion.bind(pollingContollers),
  );

pollingRouter
  .route("/finalSubmission/:pollId")
  .post(
    authMiddleware,
    pollingContollers.finalSubmission.bind(pollingContollers),
  );

pollingRouter
  .route("/getPoll/:link")
  .get(pollingContollers.getCreatedPoll.bind(pollingContollers));

pollingRouter
  .route("/updatePoll/:pollId")
  .patch(
    authMiddleware,
    pollingContollers.updatePollDetails.bind(pollingContollers),
  );

pollingRouter
  .route("/myPolls/:userId")
  .get(
    authMiddleware,
    pollingContollers.getUserSpecificCreatedPoll.bind(pollingContollers),
  );

pollingRouter
  .route("/deletePoll/:pollId")
  .delete(
    authMiddleware,
    pollingContollers.deletedPoll.bind(pollingContollers),
  );

pollingRouter
  .route("/deleteQuestion/:questionId")
  .delete(
    authMiddleware,
    pollingContollers.deleteQuestion.bind(pollingContollers),
  );

export { pollingRouter };
