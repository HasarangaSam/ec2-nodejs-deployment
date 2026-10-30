import express from "express";
import { getDatabase } from "./db.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

app.get("/api/info", (_req, res) => {
  res.status(200).json({
    name: "EC2 Node.js Deployment API",
    version: "1.0.0",
  });
});

app.get("/api/db-check", async (_req, res) => {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

export default app;
