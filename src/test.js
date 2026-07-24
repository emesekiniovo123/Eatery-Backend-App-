const { MongoClient } = require("mongodb");

const uri =
  "mongodb://josiah1:JosiahMongoDB123@ac-x0egwbs-shard-00-00.qpkw0xd.mongodb.net:27017,ac-x0egwbs-shard-00-01.qpkw0xd.mongodb.net:27017,ac-x0egwbs-shard-00-02.qpkw0xd.mongodb.net:27017/myData?ssl=true&replicaSet=atlas-dj700s-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Josiah";

async function test() {
  const client = new MongoClient(uri);

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

