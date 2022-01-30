const { ErrorModel } = require("../model/resModel");

module.exports = (req, res, next) => {
  if (req.session.userid) {
    next();
    return;
  }

  res.json(new ErrorModel("还没有登录哦~"));
};
