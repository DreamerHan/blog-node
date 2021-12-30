const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 设置 cookie 过期时间
const setCookieExpires = require("../utils/setCookieExpires");

// 存储 session 数据
const SessionData = {};

// redis
const { redisSet, redisGet } = require('../db/redis');

const handleUserRouter = (req, res) => {
  const { method } = req;

  // 假如session中通过 userid 对应

  // 登录
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;

    const result = login({ username, password });

    return result.then((data) => {
      if (data.id) {
        const { id, username, relname } = data
        // 登录时在服务端通过 Session 来存储登录状态
        SessionData[id] = { id, username, relname };

        // 存入 redis
        redisSet('session', SessionData).then(data => {
          const [err, state] = data
          if (state) {
            console.log('redis set success')
          }
        })

        // 设置 cookie 以 Session 的 key 值来设置
        res.setHeader(
          "Set-Cookie",
          `userid=${id}; path=/; httpOnly; expires=${setCookieExpires()}`
        );

        return new SuccessModel("登录成功");
      } else {
        return new ErrorModel("登录失败");
      }
    });
  }

  // 登录验证测试
  if (method === "GET" && req.path === "/api/user/login-test") {
    // 获取验证信息
    return redisGet('session').then(data => {
      const [err, session] = data

      if (session) {
        return Promise.resolve(
          new SuccessModel({
            session: session[req.cookie.userid],
            msg: "已登录，从 session 中返回当前用户信息",
          })
        );
      }

      return Promise.resolve(new ErrorModel("你还没有登录哦~"));
    })
  }
};

module.exports = handleUserRouter;