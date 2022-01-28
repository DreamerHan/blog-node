const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const blogRouter = require("./routes/blog");
const userRouter = require("./routes/user");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

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

// 路由设置
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
