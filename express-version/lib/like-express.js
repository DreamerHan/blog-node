const http = require("http");
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    this.routes = {
      all: [], // app.use() 中间件存放
      get: [], // app.post() 中间件存放
      post: [], // app.get() 中间件存放
    };
  }

  register(path) {
    const info = {};
    // 对应 app.use('/api', () => {}) 路由形式
    if (typeof path === "string") {
      info.path = path;

      // 从第二个参数开始，转成数组存入 stack 中
      // 例如 app.use('/api', fn1, fn2) => info.stack = [fn1, fn2]
      info.stack = slice.call(arguments, 1);
    } else {
      // 对应 app.use(() => {}) 的形式，可以理解成 app.use('/', () => {})
      info.path = "/";
      info.stack = slice.call(arguments, 0);
    }

    return info;
  }

  use() {
    const info = this.register.apply(this, arguments);

    // routes 走完 use 后就是 { all: [{ path: '/', stack: [middlewareFn] }], get: [], set: [] }
    this.routes.all.push(info);
  }

  get() {
    const info = this.register.apply(this, arguments);

    this.routes.get.push(info);
  }

  post() {
    const info = this.register.apply(this, arguments);

    this.routes.post.push(info);
  }

  match(method, url) {
    let stack = [];
    if (url === "/favicon.ico") {
      return stack;
    }

    // 获取 routes
    let currentRoutes = [];
    // use() 注册的中间件都需要添加
    currentRoutes = currentRoutes.concat(this.routes.all);
    // get() 与 post() 注册的分类添加
    currentRoutes = currentRoutes.concat(this.routes[method]);

    currentRoutes.forEach((routeInfo) => {
      // 假如 url = '/api/get-cookie'
      // routeInfo.path 是 '/' 或 '/api' 或 '/api/get-cookie'
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack);
      }
    });

    return stack;
  }

  // next 机制执行中间件队列
  handle(req, res, middlewareFns) {
    const next = () => {
      // 获取第一个匹配的中间件
      const middleware = middlewareFns.shift();
      if (middleware) {
        // 执行中间件函数
        middleware(req, res, next);
      }
    };

    next();
  }

  callback() {
    return (req, res) => {
      // nodejs 本身是没有 res.json 的，而 express 是通过 res.json 处理响应值的
      // 所以需要进行专门的定义
      res.json = (data) => {
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify(data));
      };

      // 通过 url 与 method 区分哪些是本次访问要执行的中间件
      const url = req.url;
      const method = req.method.toLowerCase();

      // match 这一步根据请求的 method 与 url 去筛选请求链路上的所有中间件函数
      const middlewareFns = this.match(method, url);

      this.handle(req, res, middlewareFns);
    };
  }

  // listen(port, callback)
  listen(...args) {
    const server = http.createServer(this.callback());

    server.listen(...args);
  }
}

module.exports = () => {
  return new LikeExpress();
};
