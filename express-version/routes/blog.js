var express = require("express");
var router = express.Router();

const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const loginCheck = require("../middleware/loginCheck");

// blog 列表
router.get("/list", async function (req, res, next) {
  const { author, keyword } = req.query;

  if (!author && !keyword) {
    res.json(new ErrorModel("获取失败, 没有 author 和 keyword 字段"));
    return;
  }

  const result = await getList({ author, keyword });

  if (result) {
    res.json(new SuccessModel(result, "获取成功"));
  } else {
    res.json(new ErrorModel("获取失败"));
  }
});

// blog 详情
router.get("/detail", async function (req, res, next) {
  if (!req.query.id) {
    res.json(new ErrorModel("获取失败，没有博客 id"));
    return;
  }

  const result = await getDetail(req.query.id);

  if (result && result.length) {
    res.json(new SuccessModel(result, "获取成功"));
  } else {
    res.json(new ErrorModel("获取失败"));
  }
});

// blog 新增
router.post("/new", loginCheck, async function (req, res, next) {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    res.json(new ErrorModel("创建失败，没有 title 或 content 或 author"));
    return;
  }

  const result = await newBlog(req.body);

  if (result) {
    res.json(new SuccessModel(result, "新建博客成功"));
  } else {
    res.json(new ErrorModel("新建博客失败"));
  }
});

// blog 更新
router.post("/update", loginCheck, async function (req, res, next) {
  const { title, content, id } = req.body;

  if (!id) {
    res.json(new ErrorModel("更新失败, 没有传博客 id"));
    return;
  } else if (!title && !content) {
    res.json(new ErrorModel("title 和 content 都没有任何更新"));
    return;
  }

  const result = await updateBlog(req.body);

  if (result) {
    res.json(new SuccessModel(result, "更新成功"));
  } else {
    res.json(new ErrorModel("更新失败"));
  }
});

// blog 删除
router.post("/del", loginCheck, async function (req, res, next) {
  const { id, author } = req.body;

  if (!id || !author) {
    res.json(new ErrorModel("删除失败，没有博客 id 或 author"));
    return;
  }

  const result = await deleteBlog(req.body);

  if (result) {
    res.json(new SuccessModel(result, "删除成功"));
  } else {
    res.json(new ErrorModel("删除失败"));
  }
});

module.exports = router;
