const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");

const { SuccessModel, ErrorModel } = require("../model/resModel");

const handlerBlogRouter = (req, res) => {
  const { method, path } = req;

  // 获取博客列表
  if (method === "GET" && path === "/api/blog/list") {
    const { author, keyword } = req.query;

    if (!author || !keyword) {
      return new ErrorModel("获取失败, 缺少 author 或 keyword 字段");
    }

    const result = getList({ author, keyword });
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

    const result = getDetail(req.query.id);

    if (result) {
      return new SuccessModel(result, "获取成功");
    } else {
      return new ErrorModel("获取失败");
    }
    return {
      msg: "这是获取博客详情的接口",
    };
  }

  // 新建一篇博客
  if (method === "POST" && path === "/api/blog/new") {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return new ErrorModel("创建失败，没有 title 或 content 或 author");
    }

    const result = newBlog(req.body);

    if (result) {
      return new SuccessModel(result, "获取成功");
    } else {
      return new ErrorModel("获取失败");
    }
  }

  // 更新博客
  if (method === "POST" && path === "/api/blog/update") {
    const { title, content, id } = req.body;

    if (!id) {
      return new ErrorModel("更新失败，没有博客 id");
    }

    const result = newBlog(req.body);

    if (result) {
      return new SuccessModel(result, "更新成功");
    } else {
      return new ErrorModel("更新失败");
    }
  }

  // 删除博客
  if (method === "POST" && path === "/api/blog/del") {
    const { id, author } = req.body;

    if (!id || !author) {
      return new ErrorModel("删除失败，没有博客 id 或 author");
    }

    const result = deleteBlog(req.body);

    if (result) {
      return new SuccessModel(result, "更新成功");
    } else {
      return new ErrorModel("更新失败");
    }
  }
};

module.exports = handlerBlogRouter;
