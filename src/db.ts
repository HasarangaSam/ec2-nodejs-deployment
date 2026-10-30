import { Db, MongoClient } from "mongodb";

let client: MongoClient | undefined;
let database: Db | undefined;

export async function getDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("MongoDB environment variables are missing");
  }

  const newClient = new MongoClient(uri);
  await newClient.connect();

  client = newClient;
  database = client.db(databaseName);

  return database;
}
