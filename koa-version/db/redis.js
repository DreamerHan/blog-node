const redis = require("redis");
const REDIS_CONF = require("../config/redis");

const { port, host } = REDIS_CONF;
const redisClient = redis.createClient(port, host);

// 监控错误
redisClient.on("error", () => {
  console.error("Redis Client Error", err);
});

module.exports = redisClient;
