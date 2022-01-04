const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login } = require("../controller/user");

// 设置 cookie 过期时间
const setCookieExpires = require("../utils/setCookieExpires");

// 存储 Session 数据
const SessionData = {};

const handleUserRouter = async (req, res) => {
  const { method, path } = req;

  // 登录
  if (method === "POST" && path === "/api/user/login") {
    const { username, password } = req.body;

    if (!username || !password) {
      return new ErrorModel("登录失败，没有 username 或 password");
    }

    const result = await login(req.body);

    if (result) {
      // 假设登录后，session 中通过 userid 对应

      const { id, username, relname } = result;

      // 登录时在服务端通过 Session 来存储登录状态
      SessionData[id] = { id, username, relname };

      // 设置 cookie 以 Session 的 key 值来设置
      res.setHeader(
        "Set-Cookie",
        `userid=${id}; path=/; httpOnly; expires=${setCookieExpires()}`
      );

      return new SuccessModel("登录成功");
    } else {
      return new ErrorModel("登录失败");
    }
  }

  // 校验是否登录
  if (method === "POST" && req.path === "/api/user/login-test") {
    // 获取验证信息
    const state = SessionData[req.cookie.userid];

    if (state) {
      return new SuccessModel({
        session: SessionData[req.cookie.userid],
        msg: "已登录，从 session 中返回当前用户信息",
      });
    }

    return new ErrorModel("你还没有登录哦~");
  }
};

module.exports = handleUserRouter;
