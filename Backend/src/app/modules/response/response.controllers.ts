import type { NextFunction, Request, Response } from "express";
import {
  pollsTable,
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
import { emitVoteUpdate } from "../../common/socket/socket.server.js";

class responsePollingController {
  public async submitFinalPoll(
    req: Request<submitPoll>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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
        .select({ id: pollSubmissionsTable.id })
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
      .filter((q) => q.isRequired)
      .map((q) => q.id);

    const submittedQuestionIds = answers.map((a: any) => a.questionId);

    for (const reqId of requiredQuestionIds) {
      if (!submittedQuestionIds.includes(reqId)) {
        throw ApiError.badRequest("All required questions must be answered");
      }
    }

    for (const answer of answers as any[]) {
      const matched = questions.find((q) => q.id === answer.questionId);
      if (!matched) throw ApiError.badRequest("Invalid question submitted");

      const validOptions = [matched.option1, matched.option2, matched.option3, matched.option4];
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
        .returning({ id: pollSubmissionsTable.id });

      if (!createdSubmission) throw ApiError.internal("Failed to create submission");

      const responsePayload = (answers as any[]).map((answer) => ({
        submissionId: createdSubmission.id,
        pollId,
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        respondentId: pollExist.isAnonymous ? null : userId,
      }));

      await tx.insert(responsesTable).values(responsePayload);
    });

    // Emit live vote update via socket
    try {
      const updatedAnalytics = await buildAnalyticsPayload(pollId);
      emitVoteUpdate(pollId, updatedAnalytics);
    } catch (_) {}

    ApiResponse.ok(res, "Poll submitted successfully");
    } catch (error) {
      next(error)
    }
  }

  public async creatorPollSubmit(
    req: Request<pollId>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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

    if (pollExist.status !== "active") {
      throw ApiError.badRequest("First make this poll active");
    }

    const [closedPoll] = await db
      .update(pollsTable)
      .set({ status: "closed", updatedAt: new Date() })
      .where(eq(pollsTable.id, pollId))
      .returning({
        id: pollsTable.id,
        title: pollsTable.title,
        status: pollsTable.status,
        pollLink: pollsTable.pollLink,
      });

    // Emit socket event so live viewers know poll is closed
    try {
      emitVoteUpdate(pollId, { pollClosed: true, pollId });
    } catch (_) {}

    ApiResponse.ok(res, `Poll closed successfully`, closedPoll);
    } catch (error) {
      next(error)
    }
  }

  public async finalPollResult(
    req: Request<pollLink>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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

    if (!["closed", "active"].includes(pollExist.status)) {
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
        (r) => r.questionId === question.id,
      );

      const optionVotes: Record<string, number> = {
        [question.option1]: 0,
        [question.option2]: 0,
        [question.option3]: 0,
        [question.option4]: 0,
      };

      for (const r of relatedResponses) {
        if (r.selectedOption in optionVotes) {
          optionVotes[r.selectedOption]! += 1;
        }
      }

      const totalVotes = relatedResponses.length;

      const options = Object.entries(optionVotes).map(([option, votes]) => ({
        option,
        votes,
        percentage: totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(2)) : 0,
      }));

      return {
        questionId: question.id,
        questionText: question.questionText,
        totalVotes,
        options,
      };
    });

    const uniqueSubmissions = new Set(responses.map((r) => r.submissionId));

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
    } catch (error) {
      next(error)
    }
  }

  public async completedPolls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const [userExist] = await db
      .select({ id: usersTable.id })
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
          // Fix: original had or(closed, closed) — should be or(closed, active) to show all non-draft
          or(eq(pollsTable.status, "closed"), eq(pollsTable.status, "active")),
        ),
      )
      .orderBy(desc(pollsTable.updatedAt));

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

    ApiResponse.ok(res, "Polls fetched successfully", {
      totalPolls: formattedPolls.length,
      polls: formattedPolls,
    });
    } catch (error) {
      next(error)
    }
  }

  public async getPollAnalytics(
    req: Request<pollId>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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

    const analyticsPayload = await buildAnalyticsPayload(pollId);

    ApiResponse.ok(res, "Poll analytics fetched successfully", {
      ...analyticsPayload,
      title: pollExist.title,
      status: pollExist.status,
      createdAt: pollExist.createdAt,
      expiresAt: pollExist.expiresAt,
    });
    } catch (error) {
      next(error)
    }
  }
}

// Shared helper to build analytics payload — used by both the API and socket emit
async function buildAnalyticsPayload(pollId: string) {
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

  const responses = await db
    .select({
      questionId: responsesTable.questionId,
      selectedOption: responsesTable.selectedOption,
      submissionId: responsesTable.submissionId,
    })
    .from(responsesTable)
    .where(eq(responsesTable.pollId, pollId));

  const totalResponses = responses.length;
  const uniqueSubmissions = new Set(responses.map((r) => r.submissionId));
  const totalSubmissions = uniqueSubmissions.size;
  const totalQuestions = questions.length;

  const questionAnalytics = questions.map((question) => {
    const relatedResponses = responses.filter((r) => r.questionId === question.id);
    const optionVotes: Record<string, number> = {
      [question.option1]: 0,
      [question.option2]: 0,
      [question.option3]: 0,
      [question.option4]: 0,
    };

    for (const r of relatedResponses) {
      if (r.selectedOption in optionVotes) {
        optionVotes[r.selectedOption]! += 1;
      }
    }

    const totalVotes = relatedResponses.length;
    const options = Object.entries(optionVotes).map(([option, votes]) => ({
      option,
      votes,
      percentage: totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(2)) : 0,
    }));

    return { questionId: question.id, questionText: question.questionText, totalVotes, options };
  });

  return {
    pollId,
    analytics: { totalQuestions, totalResponses, totalSubmissions },
    questions: questionAnalytics,
  };
}

export { responsePollingController };
