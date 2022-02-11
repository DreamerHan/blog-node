const router = require("koa-router")();

router.prefix("/api/user");

const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 登录
router.get("/login", async (ctx, next) => {
  const { username, password } = ctx.query;

  if (!username || !password) {
    ctx.body = new ErrorModel("登录失败，没有 username 或 password");
    return;
  }

  const result = await login(ctx.query);

  if (result) {
    const { id, _id, username, relname } = result;

    const sign = id ? id : _id;

    // 假设登录后，session 中通过 userid 对应
    const userid = `${username}-${sign}`;
    ctx.session[userid] = { id, _id, username, relname };

    ctx.body = new SuccessModel("登录成功");
  } else {
    ctx.body = new ErrorModel("登录失败");
  }
});

router.get("/login-test", async (ctx, next) => {
  const { userid } = ctx.query;

  if (ctx.session[userid]) {
    ctx.body = new SuccessModel({
      session: ctx.session,
      msg: "已登录，从 session 中返回当前用户信息",
    });
  } else {
    ctx.body = new ErrorModel("您还没有登录哦~");
  }
});

module.exports = router;
