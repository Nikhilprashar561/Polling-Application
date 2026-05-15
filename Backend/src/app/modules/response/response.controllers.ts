import type { Request, Response } from "express";
import {
  pollsTable,
  pollStatusEnum,
  pollSubmissionsTable,
  questionsTable,
  responsesTable,
  usersTable,
} from "../../../db/schema.js";
import type { pollId, pollLink, submitPoll } from "./response.interface.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

class responsePollingController {
  public async submitFinalPoll(
    req: Request<submitPoll>,
    res: Response,
  ): Promise<void> {
    // User Can Submit Poll Means Final Poll Submission

    // Get Data From Request , Means Questions Answers

    // If poll is auth required then add check only verify logged in user can

    // Extract pollId from params or poll link
    // Extract submitted answers from body
    // Verify poll exists or not
    // Verify poll status is active
    // Verify poll is not expired

    // Extract User Answer and Check they answer to all or not? REQUIRED
    // Verify all required questions are answered

    // Store pollId, UserId if Auth in Submissions Table
    // Store Question ID one by one response Table
    // Then Store Submission ID in response
    // Store Respondednt ID Also

    // Prevent duplicate submission if needed
    // Store all submitted answers in response table

    // Return success response message

    const { pollId } = req.params;

    if (!pollId?.trim()) {
      throw ApiError.badRequest("Poll ID is required");
    }

    const { answers } = req.body;

    if (!Array.isArray(answers) || !answers.length) {
      throw ApiError.badRequest("Please submit at least one answer");
    }

    const [pollExist] = await db
      .select({
        id: pollsTable.id,
        status: pollsTable.status,
        expiresAt: pollsTable.expiresAt,
        requiresAuth: pollsTable.requiresAuth,
        isAnonymous: pollsTable.isAnonymous,
      })
      .from(pollsTable)
      .where(eq(pollsTable.id, pollId))
      .limit(1);

    if (!pollExist) {
      throw ApiError.notFound("Poll not found");
    }

    if (pollExist.status !== "active") {
      throw ApiError.badRequest("Poll is not accepting responses");
    }

    if (pollExist.expiresAt && new Date(pollExist.expiresAt) < new Date()) {
      throw ApiError.badRequest("Poll has expired");
    }

    const userId = req.user?.userId ?? null;

    if (pollExist.requiresAuth && !userId) {
      throw ApiError.unauthorized("Login required to submit this poll");
    }

    const questions = await db
      .select({
        id: questionsTable.id,
        isRequired: questionsTable.isRequired,
        option1: questionsTable.option1,
        option2: questionsTable.option2,
        option3: questionsTable.option3,
        option4: questionsTable.option4,
      })
      .from(questionsTable)
      .where(eq(questionsTable.pollId, pollId));

    if (!questions.length) {
      throw ApiError.badRequest("No questions available for this poll");
    }

    if (userId) {
      const [alreadySubmitted] = await db
        .select({
          id: pollSubmissionsTable.id,
        })
        .from(pollSubmissionsTable)
        .where(
          and(
            eq(pollSubmissionsTable.pollId, pollId),
            eq(pollSubmissionsTable.respondentId, userId),
          ),
        )
        .limit(1);

      if (alreadySubmitted) {
        throw ApiError.badRequest("You have already submitted this poll");
      }
    }

    const requiredQuestionIds = questions
      .filter((question) => question.isRequired)
      .map((question) => question.id);

    const submittedQuestionIds = answers.map((answer) => answer.questionId);

    for (const requiredQuestionId of requiredQuestionIds) {
      if (!submittedQuestionIds.includes(requiredQuestionId)) {
        throw ApiError.badRequest("All required questions must be answered");
      }
    }

    for (const answer of answers) {
      const matchedQuestion = questions.find(
        (question) => question.id === answer.questionId,
      );

      if (!matchedQuestion) {
        throw ApiError.badRequest("Invalid question submitted");
      }

      const validOptions = [
        matchedQuestion.option1,
        matchedQuestion.option2,
        matchedQuestion.option3,
        matchedQuestion.option4,
      ];

      if (!validOptions.includes(answer.selectedOption)) {
        throw ApiError.badRequest("Invalid answer option submitted");
      }
    }

    await db.transaction(async (tx) => {
      const [createdSubmission] = await tx
        .insert(pollSubmissionsTable)
        .values({
          pollId,
          respondentId: pollExist.isAnonymous ? null : userId,
        })
        .returning({
          id: pollSubmissionsTable.id,
        });

      if (!createdSubmission) {
        throw ApiError.internal("Failed to create submission");
      }

      const responsePayload = answers.map((answer) => ({
        submissionId: createdSubmission.id,
        pollId,
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        respondentId: pollExist.isAnonymous ? null : userId,
      }));

      await tx.insert(responsesTable).values(responsePayload);
    });

    ApiResponse.ok(res, "Poll submitted successfully");
  }

  public async creatorPollSubmit(
    req: Request<pollId>,
    res: Response,
  ): Promise<void> {
    // creator can expire this poll anytime they want and Publis the poll
    // Creator can manually expire or close poll or Publis
    // Extract pollId from params
    // Get creator userId from request
    // Verify poll exists
    // Verify current user owns this poll
    // Change poll status to completed or expired
    // Change Poll Link to Final Submission
    // Save updated poll status and it details
    // Return updated poll response

    const { pollId } = req.params;

    if (!pollId?.trim()) {
      throw ApiError.badRequest("Poll ID is required");
    }

    const userId = req.user?.userId;

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const [pollExist] = await db
      .select()
      .from(pollsTable)
      .where(eq(pollsTable.id, pollId))
      .limit(1);

    if (!pollExist) {
      throw ApiError.notFound("Poll not found");
    }

    if (pollExist.createdBy !== userId) {
      throw ApiError.forbidden("You are not allowed to manage this poll");
    }

    const statusEnum = pollStatusEnum.enumValues[1];

    if (pollExist.status !== statusEnum) {
      throw ApiError.badRequest("First make this poll active");
    }

    // Todo :- Expiry time less than to current time throw error

    const expireAt = pollExist.expiresAt;

    if (expireAt) {
      const expires = new Date(expireAt);

      if (Number.isNaN(expireAt.getTime()))
        throw ApiError.badRequest("Invalid expiry time");

      if (expires <= new Date())
        throw ApiError.badRequest(
          "Expiry time must be greater than current time",
        );
    }

    ApiResponse.ok(res, `Poll ${pollExist.status} successfully`, pollExist);
  }

  public async finalPollResult(
    req: Request<pollLink>,
    res: Response,
  ): Promise<void> {
    // via link if they expire
    // when creator finalize the poll automaticaly convert to result
    // Get poll result by pollId or poll link
    // Verify poll exists
    // Verify poll is completed or expired
    // Fetch all poll questions
    // Fetch all submitted responses related to this poll
    // Fetch submission and Responsed for both table
    // Calculate total votes for each option
    // Calculate Answers with question
    // Generate final poll result data
    // Return poll result response

    const { pollLink } = req.params;

    if (!pollLink?.trim()) {
      throw ApiError.badRequest("Poll Link is required");
    }

    const [pollExist] = await db
      .select({
        id: pollsTable.id,
        title: pollsTable.title,
        description: pollsTable.description,
        status: pollsTable.status,
        createdAt: pollsTable.createdAt,
        expiresAt: pollsTable.expiresAt,
      })
      .from(pollsTable)
      .where(eq(pollsTable.pollLink, pollLink))
      .limit(1);

    if (!pollExist) {
      throw ApiError.notFound("Poll not found");
    }

    const allowedResultStatus = ["closed", "expired"];

    if (!allowedResultStatus.includes(pollExist.status)) {
      throw ApiError.badRequest("Poll result is not available yet");
    }

    const questions = await db
      .select({
        id: questionsTable.id,
        questionText: questionsTable.questionText,
        option1: questionsTable.option1,
        option2: questionsTable.option2,
        option3: questionsTable.option3,
        option4: questionsTable.option4,
      })
      .from(questionsTable)
      .where(eq(questionsTable.pollId, pollExist.id));

    if (!questions.length) {
      throw ApiError.badRequest("No questions found for this poll");
    }

    const responses = await db
      .select({
        questionId: responsesTable.questionId,
        selectedOption: responsesTable.selectedOption,
        respondentId: responsesTable.respondentId,
        submissionId: responsesTable.submissionId,
      })
      .from(responsesTable)
      .where(eq(responsesTable.pollId, pollExist.id));

    const formattedResults = questions.map((question) => {
      const relatedResponses = responses.filter(
        (response) => response.questionId === question.id,
      );

      const optionVotes = {
        [question.option1]: 0,
        [question.option2]: 0,
        [question.option3]: 0,
        [question.option4]: 0,
      };

      for (const response of relatedResponses) {
        const key = response.selectedOption as keyof typeof optionVotes;
        if (key in optionVotes) {
          optionVotes[key]! += 1;
        }
      }

      const totalVotes = relatedResponses.length;

      const options = Object.entries(optionVotes).map(([option, votes]) => ({
        option,
        votes,
        percentage:
          totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(2)) : 0,
      }));

      return {
        questionId: question.id,
        questionText: question.questionText,
        totalVotes,
        options,
      };
    });

    const uniqueSubmissions = new Set(
      responses.map((response) => response.submissionId),
    );

    const resultPayload = {
      pollId: pollExist.id,
      title: pollExist.title,
      description: pollExist.description,
      status: pollExist.status,
      totalQuestions: questions.length,
      totalSubmissions: uniqueSubmissions.size,
      createdAt: pollExist.createdAt,
      expiresAt: pollExist.expiresAt,
      results: formattedResults,
    };

    ApiResponse.ok(res, "Poll result fetched successfully", resultPayload);
  }

  public async completedPolls(req: Request, res: Response): Promise<void> {
    // All completed Polls
    // Get all completed or expired polls
    // Extract authenticated userId from request
    // Fetch completed polls created by this user
    // With user Id Fetch Polls
    // Return completed polls response

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

    const completedPolls = await db
      .select({
        id: pollsTable.id,
        title: pollsTable.title,
        description: pollsTable.description,
        status: pollsTable.status,
        pollLink: pollsTable.pollLink,
        expiresAt: pollsTable.expiresAt,
        createdAt: pollsTable.createdAt,
        updatedAt: pollsTable.updatedAt,
      })
      .from(pollsTable)
      .where(
        and(
          eq(pollsTable.createdBy, userId),

          or(eq(pollsTable.status, "closed"), eq(pollsTable.status, "closed")),
        ),
      )
      .orderBy(desc(pollsTable.updatedAt));

    if (!completedPolls.length) {
      throw ApiError.notFound("No completed polls found");
    }

    const formattedPolls = completedPolls.map((poll) => ({
      pollId: poll.id,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      pollLink: poll.pollLink,

      timestamps: {
        createdAt: poll.createdAt,
        updatedAt: poll.updatedAt,
        expiresAt: poll.expiresAt,
      },
    }));

    const responsePayload = {
      totalCompletedPolls: formattedPolls.length,

      polls: formattedPolls,
    };

    ApiResponse.ok(
      res,
      "Completed polls fetched successfully",
      responsePayload,
    );
  }

  public async getPollAnalytics(
    req: Request<pollId>,
    res: Response,
  ): Promise<void> {
    // Extract pollId from params
    // Verify poll exists
    // Verify current user owns this poll
    // Get total response count
    // Get total submission count
    // Get total question count
    // Get vote count for each option
    // Get poll participation analytics
    // Return analytics response

    const { pollId } = req.params;

    if (!pollId?.trim()) {
      throw ApiError.badRequest("Poll ID is required");
    }

    const userId = req.user?.userId;

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const [pollExist] = await db
      .select({
        id: pollsTable.id,
        createdBy: pollsTable.createdBy,
        title: pollsTable.title,
        status: pollsTable.status,
        createdAt: pollsTable.createdAt,
        expiresAt: pollsTable.expiresAt,
      })
      .from(pollsTable)
      .where(eq(pollsTable.id, pollId))
      .limit(1);

    if (!pollExist) {
      throw ApiError.notFound("Poll not found");
    }

    const questions = await db
      .select({
        id: questionsTable.id,
        questionText: questionsTable.questionText,

        option1: questionsTable.option1,
        option2: questionsTable.option2,
        option3: questionsTable.option3,
        option4: questionsTable.option4,
      })
      .from(questionsTable)
      .where(eq(questionsTable.pollId, pollId));

    const totalQuestions = questions.length;

    const responses = await db
      .select({
        questionId: responsesTable.questionId,

        selectedOption: responsesTable.selectedOption,

        submissionId: responsesTable.submissionId,
      })
      .from(responsesTable)
      .where(eq(responsesTable.pollId, pollId));

    const totalResponses = responses.length;

    const uniqueSubmissions = new Set(
      responses.map((response) => response.submissionId),
    );

    const totalSubmissions = uniqueSubmissions.size;

    const questionAnalytics = questions.map((question) => {
      const relatedResponses = responses.filter(
        (response) => response.questionId === question.id,
      );

      const optionVotes = {
        [question.option1]: 0,
        [question.option2]: 0,
        [question.option3]: 0,
        [question.option4]: 0,
      };

      for (const response of relatedResponses) {
        if (response.selectedOption in optionVotes) {
          optionVotes[response.selectedOption as keyof typeof optionVotes]! +=
            1;
        }
      }

      const totalVotes = relatedResponses.length;

      const options = Object.entries(optionVotes).map(([option, votes]) => ({
        option,
        votes,

        percentage:
          totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(2)) : 0,
      }));

      return {
        questionId: question.id,
        questionText: question.questionText,

        totalVotes,
        options,
      };
    });

    const participationRate =
      totalQuestions > 0
        ? Number(
            (
              totalResponses /
              totalQuestions /
              Math.max(totalSubmissions, 1)
            ).toFixed(2),
          )
        : 0;

    const analyticsPayload = {
      pollId: pollExist.id,
      title: pollExist.title,
      status: pollExist.status,

      analytics: {
        totalQuestions,
        totalResponses,
        totalSubmissions,
        participationRate,
      },

      createdAt: pollExist.createdAt,
      expiresAt: pollExist.expiresAt,

      questions: questionAnalytics,
    };

    ApiResponse.ok(
      res,
      "Poll analytics fetched successfully",
      analyticsPayload,
    );
  }
}

export { responsePollingController };
