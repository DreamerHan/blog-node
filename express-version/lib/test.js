const { time } = require("../db/redis");
const express = require("./like-express");

const app = express();

app.use((req, res, next) => {
  console.log("服务请求开始...");

  next();
});

app.use((req, res, next) => {
  console.log("设置 cookie");
  req.cookie = {
    userid: "123456",
  };

  next();
});

app.use((req, res, next) => {
  console.log("postdata 请求处理...");
  const timer = setTimeout(() => {
    req.body = {
      username: "test",
      password: "123456",
    };

    clearTimeout(timer);
    next();
  }, 5000);
});

app.use("/api", (req, res, next) => {
  console.log("/api 入口请求");
  next();
});

app.get(
  "/api/getInfo",
  (req, res, next) => {
    console.log("loginCheck");
    next();
  },
  (req, res, next) => {
    console.log("get apiInfo 入口请求");
    res.json("get 请求响应");
  }
);

app.post(
  "/api/postInfo",
  (req, res, next) => {
    console.log("loginCheck");
    next();
  },
  (req, res, next) => {
    console.log("post apiInfo 入口请求");
    res.json("post 请求响应");
  }
);

app.listen(7788, () => {
  console.log("server is running at port 7788");
});
