import express from "express";

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

export default app;
