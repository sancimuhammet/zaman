import { simulations, type Simulation, type InsertSimulation } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSimulation(id: number): Promise<Simulation | undefined>;
  getAllSimulations(): Promise<Simulation[]>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  deleteSimulation(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private simulations: Map<number, Simulation>;
  private currentId: number;

  constructor() {
    this.simulations = new Map();
    this.currentId = 1;
  }

  async getSimulation(id: number): Promise<Simulation | undefined> {
    return this.simulations.get(id);
  }

  async getAllSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const id = this.currentId++;
    
    // Generate title from category and alternative choice
    const title = insertSimulation.category 
      ? `${insertSimulation.category}: ${insertSimulation.alternativeChoice.substring(0, 50)}${insertSimulation.alternativeChoice.length > 50 ? '...' : ''}`
      : `Simülasyon: ${insertSimulation.alternativeChoice.substring(0, 50)}${insertSimulation.alternativeChoice.length > 50 ? '...' : ''}`;

    const simulation: Simulation = {
      ...insertSimulation,
      id,
      title,
      gender: insertSimulation.gender || null,
      hobbies: insertSimulation.hobbies || null,
      personality: insertSimulation.personality || null,
      results: insertSimulation.results || null,
      category: insertSimulation.category || null,
      successRate: insertSimulation.successRate || null,
      createdAt: new Date(),
    };
    this.simulations.set(id, simulation);
    return simulation;
  }

  async deleteSimulation(id: number): Promise<void> {
    this.simulations.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getSimulation(id: number): Promise<Simulation | undefined> {
    const [simulation] = await db.select().from(simulations).where(eq(simulations.id, id));
    return simulation || undefined;
  }

  async getAllSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).orderBy(desc(simulations.createdAt));
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    // Generate title from category and alternative choice
    const title = insertSimulation.category 
      ? `${insertSimulation.category}: ${insertSimulation.alternativeChoice.substring(0, 50)}${insertSimulation.alternativeChoice.length > 50 ? '...' : ''}`
      : `Simülasyon: ${insertSimulation.alternativeChoice.substring(0, 50)}${insertSimulation.alternativeChoice.length > 50 ? '...' : ''}`;

    const [simulation] = await db
      .insert(simulations)
      .values({
        ...insertSimulation,
        title
      })
      .returning();
    return simulation;
  }

  async deleteSimulation(id: number): Promise<void> {
    await db.delete(simulations).where(eq(simulations.id, id));
  }
}

export const storage = new DatabaseStorage();
