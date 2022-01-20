const getQueryData = require("./utils/getQueryData");
const getPostData = require("./utils/getPostData");
const getCookie = require("./utils/getCookie");

const { handleUserRouter, handlerBlogRouter } = require("./router/index");

// 日志
const { accessLog } = require("./utils/log");

module.exports = async (req, res) => {
  const { method, url, headers } = req;

  if (url === "/favicon.ico") return;

  // 记录访问日志 access.log
  accessLog(`${method} -- ${url} -- ${headers["user-agent"]} -- ${Date.now()}`);

  // 设置数据返回格式为 json 形式
  res.setHeader("Content-type", "application/json; text/plain;charset=utf-8");

  // req 上添加了 path 和 query 参数
  getQueryData(req);

  // postData 处理
  await getPostData(req);

  // 获取 cookie 存入 req 中
  getCookie(req);

  // user 路由接入
  const userRes = await handleUserRouter(req, res);
  if (userRes) {
    res.end(JSON.stringify(userRes));
    return;
  }

  // blog 路由接入
  const blogRes = await handlerBlogRouter(req, res);
  if (blogRes) {
    res.end(JSON.stringify(blogRes));
    return;
  }

  // 未找到数据时 404
  res.statusCode = 404;
  res.write("404 Not Found\n\r 这是404页面呀，老铁~~");
  res.end();
};
