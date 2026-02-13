import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Client-side only application.
  // We just serve the static frontend.
  // No API routes are registered here.

  return httpServer;
}
