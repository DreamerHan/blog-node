const handleUserRouter = (req, res) => {
  const { method, path } = req;

  // 登录
  if (method === "POST" && path === "/api/user/login") {
    return {
      msg: "这是登录的接口",
    };
  }

  // 登录校验
  if (method === "POST" && path === "/api/user/login-test") {
    return {
      msg: "这是登录校验的接口",
    };
  }
};

module.exports = handleUserRouter;
