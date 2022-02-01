const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const blog = require("./routes/blog");
const user = require("./routes/user");

// error handler
onerror(app);

// middlewares

// 处理 post 请求的各种类型数据(根据传入的 enableTypes 决定)，
// 将它们都解析成 json 形式的数据
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());

// 日志
app.use(logger());

// 可以理解成静态资源文件
app.use(require("koa-static")(__dirname + "/public"));

// webServer 情况下的前端视图
app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger 打印请求的时间长度
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
