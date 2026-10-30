import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./db.js";

const port = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(port, "127.0.0.1", () => {
      console.log(`API running at http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
