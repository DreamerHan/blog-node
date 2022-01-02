const mysql = require("mysql");

const MYSQL_CONF = require("../config/mysql");

// 创建链接对象
const connection = mysql.createConnection(MYSQL_CONF);

// 开始链接
connection.connect(function (err) {
  if (err) {
    console.error("mysql error connecting: " + err.stack);
    return;
  }

  console.log("mysql connected as id " + connection.threadId);
});

// 统一执行 sql 语句的函数
function execSQL(sql) {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        resolve([err, null]);
        return;
      }

      resolve([null, result]);
    });
  });

  return promise;
}

module.exports = execSQL;
