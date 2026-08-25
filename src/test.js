const { MongoClient } = require("mongodb");
require("dotenv").config();

async function test() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

test();

