var express = require("express");
var router = express.Router();

// blog 列表
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  res.json({
    errno: 0,
    data: "OK",
  });
});

module.exports = router;
