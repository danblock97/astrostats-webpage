import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

const globalForMongo = globalThis;

let client;
let clientPromise;

if (!globalForMongo._mongoClientPromise) {
  client = new MongoClient(uri, {
    //@ts-ignore - options typed per v6
    serverApi: { version: "1" },
  });
  globalForMongo._mongoClientPromise = client.connect();
}

clientPromise = globalForMongo._mongoClientPromise;

export async function getDb() {
  const dbName = process.env.MONGODB_DB || "astrostats";
  const c = await clientPromise;
  return c.db(dbName);
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}


