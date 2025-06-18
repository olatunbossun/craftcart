import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'craftcart';

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}