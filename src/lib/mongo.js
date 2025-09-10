import { MongoClient } from "mongodb";

const globalForMongo = globalThis;

let clientPromise;

function getClientPromise() {
  if (!globalForMongo._mongoClientPromise && !clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    const client = new MongoClient(uri, {
      // @ts-ignore - options typed per v6
      serverApi: { version: "1" },
    });
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise || clientPromise;
  return clientPromise;
}

export async function getDb() {
  const dbName = process.env.MONGODB_DB || "astrostats";
  const c = await getClientPromise();
  return c.db(dbName);
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

