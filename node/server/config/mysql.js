const env = process.env.NODE_ENV; // node 环境变量

let MYSQL_CONF = {};

if (env === "dev") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "blog",
  };
}

if (env === "prod") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "blog",
  };
}

module.exports = MYSQL_CONF;
