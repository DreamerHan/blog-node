const mongoose = require("mongoose");

const url = "mongodb://localhost:27017";
const dbName = "blog";

mongoose.connect(`${url}/${dbName}`, {
  // 配置信息
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});

// 链接成功
db.once("open", () => {
  console.log(`mongoose connect success`);
});

module.exports = mongoose;
