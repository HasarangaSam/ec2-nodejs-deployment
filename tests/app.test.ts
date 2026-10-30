import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API", () => {
  it("returns a healthy status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "API is running",
    });
  });

  it("returns API information", async () => {
    const response = await request(app).get("/api/info");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("EC2 Node.js Deployment API");
  });
});
