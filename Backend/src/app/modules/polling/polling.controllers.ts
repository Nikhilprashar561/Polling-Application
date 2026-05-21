import type { NextFunction, Request, Response } from "express";
import {
  pollsTable,
  pollStatusEnum,
  questionsTable,
  usersTable,
} from "../../../db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../db/index.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { desc, eq } from "drizzle-orm";
import type {
  createPoll,
  PollIdParams,
  PollLinkParams,
  questionId,
  questionOptions,
  updatePoll,
} from "./polling.interface.js";

const FRONTEND_URL = process.env.FRONTEND_HOST_URL;

class pollingContoller {
  public async createPoll(
    req: Request<{}, {}, createPoll>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // 1. Get First User Id from it's Request req.userId
    // 2. Get Data From Body :- title, description, isAnonymous, isRequiredAuth, expiresAt
    // 3. Validate first these data is Title Come , is Description come, is ExpireAt Come, is Status come
    // 4. Take Frontend URL form env and + generate a unique UUID , attach to URL
    // 5. Create a Unique URL.
    // 6. Before Creating a There are no Question Created so Status for now is "draft".
    // 7. Create a Poll Now, add all Fields , Add userId in CreatedBy.
    // Store Generated Link

    // Return a response Poll Draft Data
    try {
      const user = req.user;

      if (!user) throw ApiError.unauthorized("Unauthorized Access");

      const {
        title,
        description,
        expiresAt,
        isAnonymous = false,
        requiresAuth = true,
      } = req.body;

      if (!title.trim()) throw ApiError.badRequest("Title is required");
      if (!expiresAt) throw ApiError.badRequest("Expire date is required");

      const expireDate = new Date(expiresAt);

      if (isNaN(expireDate.getTime()))
        throw ApiError.badRequest("Invalid expire date");

      const pollUuid = uuidv4();
      const pollUniqueLink = `${FRONTEND_URL}/poll/${pollUuid}`;

      const pollStatus = pollStatusEnum.enumValues[0];

      const [creatingPoll] = await db
        .insert(pollsTable)
        .values({
          title: title,
          description: description?.trim(),

          expiresAt: expireDate,

          isAnonymous,
          requiresAuth,
          status: pollStatus,
          pollLink: pollUniqueLink,
          createdBy: user.userId,
        })
        .returning();

      if (!creatingPoll) throw ApiError.internal("Failed to Create Poll");

      ApiResponse.created(res, "Poll Draft Created Successfully", creatingPoll);
    } catch (error) {
      next(error);
    }
  }

  public async createQuestion(
    req: Request<PollIdParams, {}, questionOptions>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Extract pollId form Request
    // Extract All Require Data in From Body ? questionText, isRequired, options
    // Validate all field required from body
    // Find poll with the help of Poll id if there then Proceed
    // Validate all 4 option Come Or not ?
    // create a Question and then Attach a PollId to Question Table
    // Save Data and sent response to user
    try {
      const { pollId } = req.params;
      const {
        isRequired = false,
        questionText,
        option1,
        option2,
        option3,
        option4,
      } = req.body;

      if (!questionText?.trim())
        throw ApiError.badRequest("Question is required");
      if (!option1 || !option2 || !option3 || !option4)
        throw ApiError.badRequest("All Options are required");

      const [pollExist] = await db
        .select({ id: pollsTable.id })
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId))
        .limit(1);

      if (!pollExist) throw ApiError.badRequest("Poll does not exists");

      const [createQuestion] = await db
        .insert(questionsTable)
        .values({
          pollId: pollExist.id,
          questionText: questionText.trim(),
          isRequired,
          option1: option1.trim(),
          option2: option2.trim(),
          option3: option3.trim(),
          option4: option4.trim(),
        })
        .returning();

      if (!createQuestion)
        throw ApiError.internal("Failed to create question try again");

      ApiResponse.created(
        res,
        "Question with options created successfully",
        createQuestion,
      );
    } catch (error) {
      next(error);
    }
  }

  public async finalSubmission(
    req: Request<PollIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Extract Poll Id first .
    // Check First is Poll Exists with this ID or Not
    // Check is any one question exist in this poll or not
    // 1. Make Query in Question Table Check with the help of PollID
    // 2. Check Question How many created with this pollId
    // 3. All Fetch and store in variable
    // Check URL is Created or not.
    // Get Poll Database and then Make Status Active or Publish
    // Save the Query.
    // Return a Poll Data + All Related Question to PollId and with a Response

    try {
      const { pollId } = req.params;

      const [pollExist] = await db
        .select({
          id: pollsTable.id,
          title: pollsTable.title,
          description: pollsTable.description,
          status: pollsTable.status,
          pollLink: pollsTable.pollLink,
        })
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId))
        .limit(1);

      if (!pollExist) {
        throw ApiError.badRequest("Poll does not exist");
      }

      if (pollExist.status === "active") {
        throw ApiError.badRequest("Poll is already published");
      }

      const questions = await db
        .select({
          id: questionsTable.id,
          questionText: questionsTable.questionText,
          isRequired: questionsTable.isRequired,
          option1: questionsTable.option1,
          option2: questionsTable.option2,
          option3: questionsTable.option3,
          option4: questionsTable.option4,
          createdAt: questionsTable.createdAt,
        })
        .from(questionsTable)
        .where(eq(questionsTable.pollId, pollId));

      if (questions.length === 0)
        throw ApiError.badRequest(
          "At least one question is required before publishing poll",
        );

      if (!pollExist.pollLink?.trim())
        throw ApiError.badRequest("Poll URL is missing");

      const [updatedPoll] = await db
        .update(pollsTable)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(pollsTable.id, pollId))
        .returning({
          id: pollsTable.id,
          title: pollsTable.title,
          description: pollsTable.description,
          status: pollsTable.status,
          pollLink: pollsTable.pollLink,
          createdAt: pollsTable.createdAt,
          updatedAt: pollsTable.updatedAt,
        });

      if (!updatedPoll) throw ApiError.internal("Failed to publish poll");

      ApiResponse.ok(res, "Poll published successfully", {
        poll: updatedPoll,
        totalQuestionS: questions.length,
        questions: questions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCreatedPoll(
    req: Request<PollIdParams>,
    res: Response,
    next: NextFunction,
  ) {
    // Ways to Get Polls Via Link
    // Extarct from params , link
    // Validate check first is poll created with this poll link
    // Note :- Get created Poll with it's all questions and options a complete poll.
    // Make a Poll Table call to get poll details
    // Once poll details come extract PollId from it .
    // Make a DB call in Question Table with pollId
    // Check How many questions is created with this pollId extract all
    // Make a call and join both Poll data and Question Data , related to poll.
    // Once data is get store store in one variable and return
    // Return Poll Data with it's all question and a response message ?

    try {
      const { pollId } = req.params;

      if (!pollId?.trim()) {
        throw ApiError.badRequest("Poll Id is required");
      }

      const [pollExist] = await db
        .select({
          id: pollsTable.id,
          title: pollsTable.title,
          description: pollsTable.description,
          status: pollsTable.status,
          pollLink: pollsTable.pollLink,
          createdAt: pollsTable.createdAt,
          updatedAt: pollsTable.updatedAt,
        })
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId.trim()))
        .limit(1);

      if (!pollExist) {
        throw ApiError.badRequest("Poll does not exist");
      }

      if (pollExist.status !== "active") {
        throw ApiError.badRequest("Poll is not active");
      }

      const questions = await db
        .select({
          id: questionsTable.id,
          questionText: questionsTable.questionText,
          isRequired: questionsTable.isRequired,
          option1: questionsTable.option1,
          option2: questionsTable.option2,
          option3: questionsTable.option3,
          option4: questionsTable.option4,
          createdAt: questionsTable.createdAt,
        })
        .from(questionsTable)
        .where(eq(questionsTable.pollId, pollExist.id));

      if (questions.length === 0) {
        throw ApiError.badRequest("No questions found for this poll");
      }

      const completePoll = {
        poll: pollExist,
        totalQuestions: questions.length,
        questions,
      };

      ApiResponse.ok(res, "Poll fetched successfully", completePoll);
    } catch (error) {
      next(error);
    }
  }

  public async updatePollDetails(
    req: Request<PollIdParams, {}, updatePoll>,
    res: Response,
    next: NextFunction,
  ) {
    // update Poll Status and Visibility
    // User can Update Poll Title, Response type: isAuth, isAnonymous, expireAt, status
    // Extract pollId from params .
    // Verify first poll is Exists with this or not
    // Extract details form body creator want to update ,
    // Update a Poll
    // return Updated poll all details

    try {
      const { pollId } = req.params;

      if (!pollId?.trim()) {
        throw ApiError.badRequest("Poll ID is required");
      }

      const {
        title,
        requiresAuth,
        status,
        expiresAt,
        isAnonymous,
        description,
      } = req.body;

      const [pollExist] = await db
        .select({
          id: pollsTable.id,
          status: pollsTable.status,
        })
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId))
        .limit(1);

      if (!pollExist) {
        throw ApiError.notFound("Poll not found");
      }

      const updatePayload: Partial<typeof pollsTable.$inferInsert> = {};

      if (title !== undefined) {
        if (!title.trim()) {
          throw ApiError.badRequest("Title cannot be empty");
        }

        updatePayload.title = title.trim();
      }

      if (typeof requiresAuth === "boolean") {
        updatePayload.requiresAuth = requiresAuth;
      }

      if (typeof isAnonymous === "boolean") {
        updatePayload.isAnonymous = isAnonymous;
      }

      if (
        updatePayload.requiresAuth === true &&
        updatePayload.isAnonymous === true
      ) {
        throw ApiError.badRequest(
          "Poll cannot be both authenticated and anonymous",
        );
      }

      if (expiresAt) {
        const expireDate = new Date(expiresAt);

        if (Number.isNaN(expireDate.getTime())) {
          throw ApiError.badRequest("Invalid expire date");
        }

        if (expireDate <= new Date()) {
          throw ApiError.badRequest("Expire date must be a future date");
        }

        updatePayload.expiresAt = expireDate;
      }

      if (status) {
        const allowedStatus = pollStatusEnum.enumValues;

        allowedStatus.map((e) => {
          if (status === e) {
            updatePayload.status = e;
          }
        });
      }

      if (!Object.keys(updatePayload).length) {
        throw ApiError.badRequest(
          "Please provide at least one field to update",
        );
      }

      updatePayload.updatedAt = new Date();

      const [updatedPoll] = await db
        .update(pollsTable)
        .set(updatePayload)
        .where(eq(pollsTable.id, pollId))
        .returning({
          id: pollsTable.id,
          title: pollsTable.title,
          status: pollsTable.status,
          isAuth: pollsTable.requiresAuth,
          isAnonymous: pollsTable.isAnonymous,
          pollLink: pollsTable.pollLink,
          expireAt: pollsTable.expiresAt,
          createdAt: pollsTable.createdAt,
          updatedAt: pollsTable.updatedAt,
        });

      if (!updatedPoll) {
        throw ApiError.internal("Failed to update poll");
      }

      ApiResponse.ok(res, "Poll updated successfully", updatedPoll);
    } catch (error) {
      next(error);
    }
  }

  public async getUserSpecificCreatedPoll(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // note : {
    // Here User Get Only Poll no it's question
    // if they complete poll with it's question and option
    // then get specific poll with link or poll id
    // }
    // First Extract userId form it's request's
    // verify first user is Exists or not .
    // with that userId make DB call to poll table
    // find how many poll created with this UserId
    // Get All PollId from database how many created
    // Extract poll data
    // return poll data with reponse message

    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw ApiError.unauthorized("Unauthorized access");
      }

      const [userExist] = await db
        .select({
          id: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!userExist) {
        throw ApiError.notFound("User not found");
      }

      const createdPolls = await db
        .select({
          id: pollsTable.id,
          title: pollsTable.title,
          description: pollsTable.description,
          status: pollsTable.status,
          pollLink: pollsTable.pollLink,
          requiresAuth: pollsTable.requiresAuth,
          isAnonymous: pollsTable.isAnonymous,
          expiresAt: pollsTable.expiresAt,
          createdAt: pollsTable.createdAt,
          updatedAt: pollsTable.updatedAt,
        })
        .from(pollsTable)
        .where(eq(pollsTable.createdBy, userId))
        .orderBy(desc(pollsTable.createdAt));

      if (!createdPolls.length) {
        throw ApiError.notFound("No polls created by this user");
      }

      ApiResponse.ok(res, "User created polls fetched successfully", {
        totoalPoll: createdPolls.length,
        pollData: createdPolls,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deletedPoll(
    req: Request<PollIdParams>,
    res: Response,
    next: NextFunction,
  ) {
    // Extract PollId form params.
    // Extract UserId from its request and verify them with Database call
    // it is they exist or not ?
    // With pollId make DB Query and Check is Poll Exits or not
    // Then Verify this Poll is created by this User or not
    // verify user request id and user id store in poll
    // if both match or not
    // but before going to delete all poll
    // first verify how many questions is Created with that Poll Id
    // Make a Question DB table query and find how many Question created
    // Delete all Question related to this PollId and then we delete a Poll from Poll Table
    // if match then make a delete query and delete a poll
    // Return Delete message and response

    try {
      const { pollId } = req.params;

      if (!pollId?.trim()) {
        throw ApiError.badRequest("Poll ID is required");
      }

      const userId = req.user?.userId;

      if (!userId) {
        throw ApiError.unauthorized("Unauthorized access");
      }

      const [userExist] = await db
        .select({
          id: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!userExist) {
        throw ApiError.notFound("User not found");
      }

      const [pollExist] = await db
        .select({
          id: pollsTable.id,
          userId: pollsTable.createdBy,
          title: pollsTable.title,
        })
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId))
        .limit(1);

      if (!pollExist) {
        throw ApiError.notFound("Poll not found");
      }

      if (pollExist.userId !== userId) {
        throw ApiError.forbidden("You are not allowed to delete this poll");
      }

      await db.transaction(async (tx) => {
        const relatedQuestion = await tx
          .select({
            id: questionsTable.id,
          })
          .from(questionsTable)
          .where(eq(questionsTable.pollId, pollId));

        if (relatedQuestion.length) {
          await tx
            .delete(questionsTable)
            .where(eq(questionsTable.pollId, pollId));
        }

        const deletePoll = await tx
          .delete(pollsTable)
          .where(eq(pollsTable.id, pollId))
          .returning({
            id: pollsTable.id,
            title: pollsTable.title,
          });

        if (!deletePoll.length)
          throw ApiError.internal("Failed to delete poll");
      });

      ApiResponse.ok(res, "Poll deleted successfully", { pollId });
    } catch (error) {
      next(error);
    }
  }

  public async deleteQuestion(
    req: Request<questionId>,
    res: Response,
    next: NextFunction,
  ) {
    //  First Verify User With it's request with UserId
    // Extract Question Id from Params .
    // Question DB Query find question in database.
    // If Exist then make a delete query and then delete a question from database.
    // return a Delete Message and Response

    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw ApiError.unauthorized("Unauthorized access");
      }

      const { questionId } = req.params;

      if (!questionId?.trim()) {
        throw ApiError.badRequest("Question ID is required");
      }

      const [userExist] = await db
        .select({
          id: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!userExist) {
        throw ApiError.notFound("User not found");
      }

      const [questionExist] = await db
        .select({
          id: questionsTable.id,
          pollId: questionsTable.pollId,
          questionText: questionsTable.questionText,
        })
        .from(questionsTable)
        .where(eq(questionsTable.id, questionId))
        .limit(1);

      if (!questionExist) {
        throw ApiError.notFound("Question not found");
      }

      const [pollExist] = await db // find poll with the help of poll id register in question table .
        .select({
          id: pollsTable.id,
          userId: pollsTable.createdBy,
        })
        .from(pollsTable)
        .where(eq(pollsTable.id, questionExist.pollId))
        .limit(1);

      if (!pollExist) {
        throw ApiError.notFound("Related poll not found");
      }

      if (pollExist.userId !== userId) {
        throw ApiError.forbidden("You are not allowed to delete this question");
      }

      const deletedQuestion = await db
        .delete(questionsTable)
        .where(eq(questionsTable.id, questionId))
        .returning({
          id: questionsTable.id,
          questionText: questionsTable.questionText,
        });

      if (!deletedQuestion.length) {
        throw ApiError.internal("Failed to delete question");
      }

      ApiResponse.ok(res, "Question deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

export { pollingContoller };
