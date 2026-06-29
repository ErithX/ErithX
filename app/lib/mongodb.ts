import { Db, GridFSBucket, MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  return uri;
}

export async function getMongoClient() {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), {
      tls: true,
   
      tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production",
    });
    globalForMongo.mongoClientPromise = client.connect().catch((err) => {
      // Clear cached promise so next call retries the connection.
      delete globalForMongo.mongoClientPromise;
      throw err;
    });
  }

  return globalForMongo.mongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "dsa-quest");
}

export async function getResourceFilesBucket() {
  const db = await getMongoDb();
  return new GridFSBucket(db, { bucketName: "resource_files" });
}
