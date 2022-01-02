const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login } = require("../controller/user");

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
      return new SuccessModel("登录成功");
    } else {
      return new ErrorModel("登录失败");
    }
  }

  // 登录校验
  if (method === "POST" && path === "/api/user/login-test") {
    return {
      msg: "这是登录校验的接口",
    };
  }
};

module.exports = handleUserRouter;
