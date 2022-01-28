const env = process.env.NODE_ENV; // node 环境变量

let REDIS_CONF = {};

if (env === "dev") {
  REDIS_CONF = {
    host: "127.0.0.1",
    port: 6379,
  };
}

if (env === "prod") {
  REDIS_CONF = {
    host: "127.0.01",
    port: 6379,
  };
}

module.exports = REDIS_CONF;