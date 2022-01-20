const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login } = require("../controller/user");

// 设置 cookie 过期时间
const setCookieExpires = require("../utils/setCookieExpires");

// 存储 Session 数据
const SessionData = {};

// redis
const { redisSet, redisGet } = require("../db/redis");

const handleUserRouter = async (req, res) => {
  const { method, path } = req;

  // 登录
  if (method === "GET" && path === "/api/user/login") {
    const { username, password } = req.query;

    if (!username || !password) {
      return new ErrorModel("登录失败，没有 username 或 password");
    }

    const result = await login(req.query);

    if (result) {
      const { id, username, relname } = result;

      // 假设登录后，session 中通过 userid 对应
      const userid = `${username}-${id}`;

      // 登录时在服务端通过 Session 来存储登录状态
      SessionData[userid] = { id, username, relname };

      // 数据存入 redis

      // 取出当前的 session 存储
      let [getErr, redisSession] = await redisGet("session");
      if (redisSession) {
        Object.assign(redisSession, SessionData);
      } else {
        redisSession = SessionData;
      }

      // session 存入 redis 中
      const [setErr, setResult] = await redisSet("session", redisSession);

      if (setResult) {
        console.log("redis set success");
      }

      // 设置 cookie 以 Session 的 key 值来设置
      res.setHeader(
        "Set-Cookie",
        `userid=${userid}; path=/; httpOnly; expires=${setCookieExpires()}`
      );

      return new SuccessModel("登录成功");
    } else {
      return new ErrorModel("登录失败");
    }
  }

  // 校验是否登录
  if (method === "POST" && req.path === "/api/user/login-test") {
    // 获取 Redis 存储
    const [err, redisSession] = await redisGet("session");

    if (!redisSession) {
      return new ErrorModel("你还没有登录哦~");
    }

    // 获取当前登录人的信息
    const loginInfo = redisSession[req.cookie.userid];

    if (loginInfo) {
      return new SuccessModel({
        session: redisSession[req.cookie.userid],
        msg: "已登录，从 session 中返回当前用户信息",
      });
    }

    return new ErrorModel("你还没有登录哦~");
  }
};

module.exports = handleUserRouter;
