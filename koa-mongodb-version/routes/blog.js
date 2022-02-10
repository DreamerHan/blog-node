const router = require("koa-router")();

router.prefix("/api/blog");

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
router.get("/list", async function (ctx, next) {
  const { author, keyword } = ctx.query;

  if (!author && !keyword) {
    ctx.body = new ErrorModel("获取失败, 没有 author 和 keyword 字段");
    return;
  }

  const result = await getList({ author, keyword });

  if (result) {
    ctx.body = new SuccessModel(result, "获取成功");
  } else {
    ctx.body = new ErrorModel("获取失败");
  }
});

// blog 详情
router.get("/detail", async function (ctx, next) {
  if (!ctx.query.id) {
    ctx.body = new ErrorModel("获取失败，没有博客 id");
    return;
  }

  const result = await getDetail(ctx.query.id);

  if (result && result.length) {
    ctx.body = new SuccessModel(result, "获取成功");
  } else {
    ctx.body = new ErrorModel("获取失败");
  }
});

// blog 新增
router.post("/new", loginCheck, async function (ctx, next) {
  const { title, content, author } = ctx.request.body;

  if (!title || !content || !author) {
    ctx.body = new ErrorModel("创建失败，没有 title 或 content 或 author");
    return;
  }

  const result = await newBlog(ctx.request.body);

  if (result) {
    ctx.body = new SuccessModel(result, "新建博客成功");
  } else {
    ctx.body = new ErrorModel("新建博客失败");
  }
});

// blog 更新
router.post("/update", loginCheck, async function (ctx, next) {
  const { title, content, id } = ctx.request.body;

  if (!id) {
    ctx.body = new ErrorModel("更新失败, 没有传博客 id");
    return;
  } else if (!title && !content) {
    ctx.body = new ErrorModel("title 和 content 都没有任何更新");
    return;
  }

  const result = await updateBlog(ctx.request.body);

  if (result) {
    ctx.body = new SuccessModel(result, "更新成功");
  } else {
    ctx.body = new ErrorModel("更新失败");
  }
});

// blog 删除
router.post("/del", loginCheck, async function (ctx, next) {
  const { id, author } = ctx.request.body;

  if (!id || !author) {
    ctx.body = new ErrorModel("删除失败，没有博客 id 或 author");
    return;
  }

  const result = await deleteBlog(ctx.request.body);

  if (result) {
    ctx.body = new SuccessModel(result, "删除成功");
  } else {
    ctx.body = new ErrorModel("删除失败");
  }
});

module.exports = router;
