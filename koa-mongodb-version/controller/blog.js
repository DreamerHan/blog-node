const Blog = require("../db/models/Blog");
// 防止 XSS 攻击
const xss = require("xss");

// 最好不要从参数里直接结构，因为如果调用时没有传参，就会导致报错
// 这里觉得最好的方式是用参数名获取参数，并且给参数设置默认值,这样后续的解构赋值不会因为漏传参数而导致报错
const getList = async (params = {}) => {
  const { author = "", keyword = "" } = params;

  const whereOpt = {};
  if (author) whereOpt.author = author;

  // keyword 支持模糊查询
  if (keyword) whereOpt.keyword = new RegExp(keyword);

  const list = await Blog.find(whereOpt).sort({ _id: -1 });

  return list;
};

// 博客详情
const getDetail = async (id) => {
  const blog = await Blog.findById({ _id: id });

  return blog ? [blog] : [];
};

// 新建博客
const newBlog = async (blogData = {}) => {
  // blogData 是一个博客信息对象，包含 title content 等属性
  let { title, content, author } = blogData;
  title = xss(title);
  content = xss(content);
  author = xss(author);

  const blog = await Blog.create({
    title,
    content,
    author,
  });

  return { id: blog._id };
};

// 更新博客
const updateBlog = async (blogData = {}) => {
  // blogData 是一个博客信息对象，包含 title content 等属性
  let title = xss(blogData.title);
  let content = xss(blogData.content);
  const id = blogData.id;

  const blog = await Blog.findOneAndUpdate(
    { _id: id },
    { title, content },
    { new: true }
  );

  return blog;
};

// 删除 博客
const deleteBlog = async (blogData = {}) => {
  const { id, author } = blogData;

  const result = await Blog.findOneAndDelete({ _id: id, author });

  return result;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
