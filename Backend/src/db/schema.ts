import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "active",
  "closed",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: varchar("full_name", { length: 45 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 66 }).notNull(),

  avatar: text("avatar"),
  refreshToken: text("refresh_token"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const pollsTable = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdBy: uuid("created_by")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  title: text("title").notNull(),
  description: text("description"),

  isAnonymous: boolean("is_anonymous").notNull().default(false),
  requiresAuth: boolean("requires_auth").notNull().default(true),
  status: pollStatusEnum("status").notNull().default("draft"),

  pollLink: text("poll_link"),

  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => pollsTable.id, { onDelete: "cascade" }),

  questionText: text("question_text").notNull(),
  isRequired: boolean("is_required").notNull().default(true),

  option1: text("option_1").notNull(),
  option2: text("option_2").notNull(),
  option3: text("option_3").notNull(),
  option4: text("option_4").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pollSubmissionsTable = pgTable("poll_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  pollId: uuid("poll_id")
    .notNull()
    .references(() => pollsTable.id, { onDelete: "cascade" }),
  respondentId: uuid("respondent_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),

  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  questionId: uuid("question_id")
    .notNull()
    .references(() => questionsTable.id, { onDelete: "cascade" }),

  submissionId: uuid("submission_id")
    .notNull()
    .references(() => pollSubmissionsTable.id, { onDelete: "cascade" }),
    
  respondentId: uuid("respondent_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),

  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
