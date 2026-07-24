const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://josiah1:JosiahMongoDB123@ac-x0egwbs-shard-00-00.qpkw0xd.mongodb.net:27017,ac-x0egwbs-shard-00-01.qpkw0xd.mongodb.net:27017,ac-x0egwbs-shard-00-02.qpkw0xd.mongodb.net:27017/myData?ssl=true&replicaSet=atlas-dj700s-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Josiah"

)
.then(() => {
  console.log("✅ Connected!");
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});


