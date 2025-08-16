import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (db) return db;

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
  }

  if (!process.env.MONGODB_DB_NAME) {
    throw new Error('Please define MONGODB_DB_NAME environment variable');
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  
  db = client.db(process.env.MONGODB_DB_NAME);
  return db;
}

export async function getCollection(name: string) {
  const db = await connectToDatabase();
  return db.collection(name);
}

// Create indexes
export async function createIndexes() {
  const db = await connectToDatabase();

  // Artifacts indexes
  await db.collection('artifacts').createIndexes([
    { key: { owner: 1 } },
    { key: { status: 1 } },
    { key: { type: 1 } },
    { key: { 'verifierRuns.status': 1 } },
    { key: { createdAt: -1 } }
  ]);

  // Verifier runs indexes
  await db.collection('verifier_runs').createIndexes([
    { key: { artifactId: 1 } },
    { key: { status: 1 } },
    { key: { startedAt: -1 } }
  ]);

  // Proof packs indexes
  await db.collection('proof_packs').createIndexes([
    { key: { artifactId: 1 } },
    { key: { owner: 1 } },
    { key: { ipfsCid: 1 }, unique: true },
    { key: { createdAt: -1 } }
  ]);
}
