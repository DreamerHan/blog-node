var express = require("express");
var router = express.Router();

// blog 列表
router.get("/list", function (req, res, next) {
  res.json({
    errno: 0,
    data: [1, 2, 3],
  });
});

// blog 详情
router.get("/detail", function (req, res, next) {
  res.json({
    errno: 0,
    data: "OK",
  });
});

module.exports = router;
