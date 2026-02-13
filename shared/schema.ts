import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Dummy table to satisfy backend infrastructure (unused by frontend)
export const app_state = pgTable("app_state", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
});

// === LOCAL STORAGE STATE SCHEMAS ===

export const userProfileSchema = z.object({
  name: z.string(),
  age: z.string(),
  location: z.string(),
  school: z.string(),
  languages: z.string(),
});

export const initialSurveySchema = z.object({
  favoriteSubjects: z.string(),
  weakSubjects: z.string(),
  interests: z.string(),
  learningStyle: z.enum(["Visual", "Audio", "Reading", "Kinesthetic"]),
  studyMethod: z.enum(["Active recall", "Spaced repetition", "Practice problems", "Concept explanation", "Flashcards"]),
  academicGoals: z.string(),
  personalGoals: z.string(),
});

export const moodEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  rating: z.number().min(1).max(5),
  note: z.string().optional(),
});

export const finalSurveySchema = z.object({
  personality: z.record(z.string(), z.string()), // e.g., "Analytical": "Agree"
  values: z.array(z.string()),
  preferences: z.object({
    workEnvironment: z.string(),
    studyEnvironment: z.string(),
    location: z.string(),
    approach: z.string(),
  }),
});

export const studyPlanSchema = z.object({
  weeklyGoals: z.array(z.string()),
  recommendedMethod: z.string(),
  practiceBlocks: z.array(z.object({
    subject: z.string(),
    duration: z.string(),
    task: z.string()
  }))
});

export const methodFeedbackSchema = z.object({
  method: z.string(),
  helpful: z.boolean(),
  date: z.string(),
});

export const scheduleCompletionSchema = z.object({
  blockKey: z.string(),
  date: z.string(),
  completed: z.boolean(),
});

// Unified State Object
export const eduBridgeStateSchema = z.object({
  userProfile: userProfileSchema.optional(),
  summaryComplete: z.boolean().optional(),
  initialSurvey: initialSurveySchema.optional(),
  diagnosticResults: z.any().optional(),
  studyPlan: studyPlanSchema.optional(),
  moodEntries: z.array(moodEntrySchema).default([]),
  finalSurvey: finalSurveySchema.optional(),
  // Mock data results would be stored here
  careerMatches: z.array(z.any()).default([]),
  universityMatches: z.array(z.any()).default([]),
  meetingRequests: z.array(z.any()).default([]),
  methodFeedback: z.array(methodFeedbackSchema).default([]),
  scheduleCompletions: z.array(scheduleCompletionSchema).default([]),
  savedUniversities: z.array(z.number()).default([]),
  universityChecklist: z.record(z.array(z.string())).default({}),
});

export type EduBridgeState = z.infer<typeof eduBridgeStateSchema>;
