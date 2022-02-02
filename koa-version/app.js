const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");

const { host, port } = require("./config/redis");
const { SECRET_KEY } = require("./config/global");

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

// 设置 session 与 redis 的存储
// 1.设置密钥
app.keys = [SECRET_KEY];
// session 的设置与存储
app.use(
  session({
    // 设置 cookie
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    // 配置 redis
    store: redisStore({
      all: `${host}:${port}`,
    }),
  })
);

// routes
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
