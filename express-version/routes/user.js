const express = require("express");
const session = require("express-session");
const router = express.Router();

const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 登录
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.json(new ErrorModel("登录失败，没有 username 或 password"));
    return;
  }

  const result = await login(req.body);

  if (result) {
    const { id, username, relname } = result;

    // 假设登录后，session 中通过 userid 对应
    const userid = `${username}-${id}`;

    req.session[userid] = { id, username, relname };

    res.json(new SuccessModel("登录成功"));
  } else {
    res.json(new ErrorModel("登录失败"));
  }
});

router.post("/login-test", (req, res, next) => {
  if (req.session.userid) {
    res.json(
      new SuccessModel({
        session: req.session,
        msg: "已登录，从 session 中返回当前用户信息",
      })
    );
  } else {
    res.json(new ErrorModel("您还没有登录哦~"));
  }
});

module.exports = router;
