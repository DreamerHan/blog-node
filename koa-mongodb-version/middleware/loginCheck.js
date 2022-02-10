const { ErrorModel } = require("../model/resModel");

module.exports = async (ctx, next) => {
  if (ctx.session.userid) {
    await next();
    return;
  }

  ctx.body = new ErrorModel("还没有登录哦~");
};
