// 对应 Blog 的 Collection
const mongoose = require("../mongoose");

// 用 Schema 定义数据规范
const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", BlogSchema);

module.exports = Blog;
