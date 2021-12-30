const getQueryData = require("./utils/getQueryData");
const getPostData = require("./utils/getPostData");

module.exports = async (req, res) => {
  // 设置数据返回格式为 json 形式
  res.setHeader("Content-type", "application/json; text/plain;charset=utf-8");

  // req 上添加了 path 和 query 参数
  getQueryData(req);

  await getPostData(req);

  // 未找到数据时 404
  res.setHeader(404);
  res.write("404 Not Found\n\r 这是404页面呀，老铁~~");
  res.end();
};
