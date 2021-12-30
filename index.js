const redis = require("redis");

/**  创建 redis 客户端
 * @method createClient(param1, params2)
 * @param1 port - 默认是6379
 * @param2 host - 本地 127.0.0.1
 */
// 创建 redis 客户端
const redisClient = redis.createClient();

(async () => {
  // 监听错误
  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  await redisClient.connect();

  // 存储
  const result = await redisClient
    .set("myname", "hanzz")
    .then((data) => [null, data])
    .catch((err) => [err, null]);
  console.log("set", result); // set OK

  // 获取
  const value = await redisClient.get("myname");

  console.log("get", value); // get hanzz

  // 退出
  redisClient.quit();
})();
