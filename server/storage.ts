import { app_state } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Minimal storage interface to satisfy server requirements
  // The app is client-side, so this is mostly a stub
  healthCheck(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async healthCheck(): Promise<boolean> {
    try {
      await db.select().from(app_state).limit(1);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
