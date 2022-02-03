const Koa = require("./likeKoa2");
const json = require("koa-json");

const app = new Koa();

function getPostData(ctx) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      ctx.body = {
        username: "test",
        password: "123456",
      };

      clearTimeout(timer);
      resolve();
    }, 3000);
  });
}

// 日志
// app.use(json());

app.use(async (ctx, next) => {
  console.log("1 like koa2 服务请求开始...");

  await next();

  console.log("7 like koa2 服务请求结束...");
});

// 日志 你不包 promise.resolve() 放这，它绝对报错
app.use(json());

// 这个就用来测试
app.use(async (ctx, next) => {
  console.log("2 设置 cookie");
  ctx.cookie = {
    userid: "123456",
  };

  await next();

  console.log("6 cookie 设置结束");
});

app.use(async (ctx, next) => {
  console.log("3 postdata 请求处理...");
  await getPostData(ctx);

  await next();

  console.log("5 postdata 请求结束...");
});

app.use((ctx) => {
  console.log("4 like koa2 执行了到这里...");
});

app.listen(7788, () => {
  console.log("like koa2 is running at port 7788");
});
