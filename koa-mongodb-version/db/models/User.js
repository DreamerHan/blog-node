// 对应 User 的 Collection

const mongoose = require("../mongoose");

// 用 Schema 定义数据规范
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true, // 唯一，不能重复
    },
    password: String,
    relname: String,
  },
  { timestamps: true }
);

// Model 的规范Collection
// 注意点：数据库里是 users，我们这里可以直接写成 user，mongoose 会自动变成 users
const User = mongoose.model("user", UserSchema);
// 如果数据库里没有 user 这个 collection，会自动创建设置的 collection

module.exports = User;
