import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  currentSituation: text("current_situation").notNull(),
  currentGoals: text("current_goals").notNull(),
  alternativeChoice: text("alternative_choice").notNull(),
  age: integer("age").notNull(),
  gender: text("gender"),
  hobbies: text("hobbies"),
  personality: text("personality"),
  results: jsonb("results"),
  category: text("category"),
  successRate: integer("success_rate"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
  title: true,
});

export const simulationFormSchema = insertSimulationSchema.omit({
  results: true,
  category: true,
  successRate: true,
}).extend({
  age: z.number().min(16).max(80),
  gender: z.string().optional(),
  hobbies: z.string().min(1, "Hobiler alanı zorunludur"),
  personality: z.string().min(1, "Kişilik özellikleri alanı zorunludur"),
});

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;
export type SimulationForm = z.infer<typeof simulationFormSchema>;

export interface SimulationResults {
  futureLetterAlternative: {
    letter: string;
    timeline: string;
    location: string;
    mood: string;
  };
  futureLetterCurrent: {
    letter: string;
    timeline: string;
    location: string;
    mood: string;
  };
  comparison: {
    majorDifferences: string;
    emotionalTone: string;
    lifeEvents: string;
  };
  overallScore: number;
  category: string;
}
