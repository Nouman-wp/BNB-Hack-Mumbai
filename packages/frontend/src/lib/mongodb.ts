import { MongoClient, Db, Collection } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error('Please define MONGODB_DB_NAME environment variable');
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
  }
  
  db = client.db(process.env.MONGODB_DB_NAME);
  return db;
}

export async function getCollection(name: string): Promise<Collection> {
  const db = await connectToDatabase();
  return db.collection(name);
}
