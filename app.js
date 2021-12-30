// 解析 get 参数
const querystring = require("querystring");

// 路由
const { handleUserRouter, handlerBlogRouter } = require("./src/router");

// 获取 post 的传输数据
const getPostData = require("./src/utils/getPostData");

// redis
const { redisSet, redisGet } = require('./src/db/redis');

// 服务逻辑处理
const serverHandler = async (req, res) => {
  // 设置返回格式为 json
  res.setHeader("Content-type", "application/json; text/plain; charset=utf-8");

  // query 参数
  const [path, query] = req.url.split("?");
  req.path = path;
  req.query = querystring.parse(query);

  // post data 处理
  const postData = await getPostData(req);
  req.body = postData; // req.body 本身是不存在的

  // 解析 cookie
  // cookie 默认在 req.headers.cookie 中携带，格式 key1=val1; key2=val2;
  req.cookie = {};

  const cookieStr = req.headers.cookie || "";
  cookieStr.split("; ").forEach((item) => {
    // 不存在就 return，否则会产生 {"": undefined} 的数据
    if (!item) {
      return;
    }
    const [key, value] = item.split("=");
    req.cookie[key] = value;
  });

  // 使用博客路由
  const blogData = await handlerBlogRouter(req, res);
  if (blogData) {
    res.end(JSON.stringify(blogData));
    // 不加 return 会继续后续的执行
    return;
  }

  // 使用用户路由
  const userData = await handleUserRouter(req, res);
  if (userData) {
    res.end(JSON.stringify(userData));
    return;
  }

  // 未找到数据 404; text/plian 代表文本
  res.writeHead(404, { "Content-type": "text/plain;charset=utf-8" });
  res.write("404 Not Found\n\r 这是404页面呀, 老铁~");
  res.end();
};

module.exports = serverHandler;