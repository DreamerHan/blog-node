const redis = require("redis");
const REDIS_CONF = require("../config/redis");

const { port, host } = REDIS_CONF;

const client = redis.createClient(port, host);

// 监控错误
client.on("error", () => {
  console.error("Redis Client Error", err);
});

// 创建链接
client.connect();

async function redisSet(key, val) {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }

  const result = await client
    .set(key, val)
    .then((data) => [null, data])
    .catch((err) => [err, null]);

  return result;
}

async function redisGet(key) {
  const [err, data] = await client
    .get(key)
    .then((data) => [null, data])
    .catch((err) => [err, null]);

  // 鉴于存储时可能是 object，进行了 JSON.stringify操作
  // 获取时通过 parse 进行一次解析，如果出错了说明存储时不是 object, catch 中返回 val
  let value

  try {
    value = JSON.parse(data)
  } catch(err) {
    value = data
  }

  return [err, value]
}

module.exports = {
  redisSet,
  redisGet,
};
