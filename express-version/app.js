const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// 引入 session 中间件
const expressSession = require("express-session");

// 引入 redis 中间件并关联 express-session
const RedisStore = require("connect-redis")(expressSession);

const blogRouter = require("./routes/blog");
const userRouter = require("./routes/user");

const app = express();

app.use((req, res, next) => {
  if (req.path !== "/favicon.ico") {
    next();
  }
});

app.use(logger("dev"));

// 处理 post 请求的数据
// 用来解析 content-type=application 形式的数据，放到 req.body 中
app.use(express.json());

// post 请求中解析其余格式的数据解析放在 req.body 中
app.use(express.urlencoded({ extended: false }));

// 解析 cookie
app.use(cookieParser());

// webServer 服务话，获取静态文件的操作处理
app.use(express.static(path.join(__dirname, "public")));

// session 与 cookie 的设置处理
// session 与 cookie 本身是同步的，所以 express-session中间件直接对两者进行了设置
const redisClient = require("./db/redis");
const { SECRET_KEY } = require("./config/global");
app.use(
  expressSession({
    store: new RedisStore({ client: redisClient }), // [重点] 这里配置后存入 redis 中，否则默认存入内存中
    secret: SECRET_KEY, // 加密密匙
    saveUninitialized: false, // [必传] 是否强制将"未初始化"的会话保存起来
    resave: true, // [必传] 请求期间未修改会话，是否也进行强制存储
    cookie: {
      path: "/", // [默认 /] cookie 存储根目录
      httpOnly: true, // [默认 true] 前端修改限制
      maxAge: 24 * 60 * 60 * 1000, // 24小时时效
    },
  })
);

// 路由设置
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("报错了", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.status);
});

module.exports = app;
