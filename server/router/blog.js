const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");

const { SuccessModel, ErrorModel } = require("../model/resModel");

// 从 redis 中获取登录状态
const { redisGet } = require("../db/redis");

// 登录状态查询
async function loginCheck(req) {
  const [err, redisSession] = await redisGet("session");

  if (!redisSession || !redisSession[req.cookie.userid]) {
    return new ErrorModel("你还没有登录哦~");
  }
}

const handlerBlogRouter = async (req, res) => {
  const { method, path } = req;

  // 获取博客列表
  if (method === "GET" && path === "/api/blog/list") {
    const { author, keyword } = req.query;

    if (!author && !keyword) {
      return new ErrorModel("获取失败, 没有 author 和 keyword 字段");
    }

    const result = await getList({ author, keyword });

    if (result) {
      return new SuccessModel(result, "获取成功");
    } else {
      return new ErrorModel("获取失败");
    }
  }

  // 获取博客详情
  if (method === "GET" && path === "/api/blog/detail") {
    if (!req.query.id) {
      return new ErrorModel("获取失败，没有博客 id");
    }

    const result = await getDetail(req.query.id);

    if (result) {
      return new SuccessModel(result, "获取成功");
    } else {
      return new ErrorModel("获取失败");
    }
  }

  // 新建一篇博客
  if (method === "POST" && path === "/api/blog/new") {
    // 如果未登录，loginState 才有值
    const loginState = await loginCheck(req);
    if (loginState) {
      return loginState;
    }

    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return new ErrorModel("创建失败，没有 title 或 content 或 author");
    }

    const result = await newBlog(req.body);

    if (result) {
      return new SuccessModel(result, "新建博客成功");
    } else {
      return new ErrorModel("新建博客失败");
    }
  }

  // 更新博客
  if (method === "POST" && path === "/api/blog/update") {
    // 如果未登录，loginState 才有值
    const loginState = await loginCheck(req);
    if (loginState) {
      return loginState;
    }

    const { title, content, id } = req.body;

    if (!id) {
      return new ErrorModel("更新失败, 没有传博客 id");
    } else if (!title && !content) {
      return new ErrorModel("title 和 content 都没有任何更新");
    }

    const result = await updateBlog(req.body);

    if (result) {
      return new SuccessModel(result, "更新成功");
    } else {
      return new ErrorModel("更新失败");
    }
  }

  // 删除博客
  if (method === "POST" && path === "/api/blog/del") {
    // 如果未登录，loginState 才有值
    const loginState = await loginCheck(req);
    if (loginState) {
      return loginState;
    }

    const { id, author } = req.body;

    if (!id || !author) {
      return new ErrorModel("删除失败，没有博客 id 或 author");
    }

    const result = await deleteBlog(req.body);

    if (result) {
      return new SuccessModel(result, "更新成功");
    } else {
      return new ErrorModel("更新失败");
    }
  }
};

module.exports = handlerBlogRouter;
