const http = require("http");

// 组合中间件
function compose(middlewares) {
  // ctx 就是外围定义的 ctx
  return function (ctx) {
    function dispatch(i) {
      const fn = middlewares[i];

      try {
        // return Promise.resolve(
        //   // dispath 的重复调用其实就是 next 函数的执行
        //   fn(ctx, dispatch.bind(null, i + 1))
        // );
        return fn(ctx, dispatch.bind(null, i + 1));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0);
  };
}

class LikeKoa2 {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
    // 返回当前实例，可以使用 app.use().use()的莲师调用
    return this;
  }

  createContext(req, res) {
    const ctx = {
      req,
      res,
    };

    return ctx;
  }

  handleRequest(ctx, fn) {
    return fn(ctx);
  }

  callback() {
    const fn = compose(this.middlewares);
    return (req, res) => {
      const ctx = this.createContext(req, res);

      return this.handleRequest(ctx, fn);
    };
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = LikeKoa2;
