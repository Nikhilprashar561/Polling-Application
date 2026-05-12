import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "active",
  "closed",
]);
 
export const questionTypeEnum = pgEnum("question_type", [
  "single_choice",
  "multiple_choice",
  "free_text",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: varchar('full_name',{ length: 45 }).notNull(),
  email: varchar("email",{ length: 255 }).notNull().unique(),

  password: varchar('password', { length: 66 }).notNull(),

  avatar: text("avatar"),
  refreshToken: text("refresh_token"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

export const polls = pgTable("polls", {
  id:           uuid("id").primaryKey().defaultRandom(),
  createdBy:    uuid("created_by").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  title:        text("title").notNull(),
  description:  text("description"),
  isAnonymous:  boolean("is_anonymous").notNull().default(false),
  requiresAuth: boolean("requires_auth").notNull().default(true),
  status:       pollStatusEnum("status").notNull().default("draft"),
  pollLink:     text("poll_link"),                                                                           
  expiresAt:    timestamp("expires_at", { withTimezone: true }),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id:           uuid("id").primaryKey().defaultRandom(),
  pollId:       uuid("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: questionTypeEnum("question_type").notNull().default("single_choice"),
  isMandatory:  boolean("is_mandatory").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0), // controls render order
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const options = pgTable("options", {
  id:           uuid("id").primaryKey().defaultRandom(),
  questionId:   uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  optionText:   text("option_text").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pollSubmissions = pgTable("poll_submissions", {
  id:           uuid("id").primaryKey().defaultRandom(),
  pollId:       uuid("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  respondentId: uuid("respondent_id").references(() => usersTable.id, { onDelete: "set null" }),
  submittedAt:  timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const responses = pgTable("responses", {
  id:           uuid("id").primaryKey().defaultRandom(),
  questionId:   uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  optionId:     uuid("option_id").references(() => options.id, { onDelete: "set null" }), // null for free_text
  submissionId: uuid("submission_id").notNull().references(() => pollSubmissions.id, { onDelete: "cascade" }),
  respondentId: uuid("respondent_id").references(() => usersTable.id, { onDelete: "set null" }),
  freeText:     text("free_text"),      // null for choice-based answers
  submittedAt:  timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});
