const mysql = require('mysql')

const MYSQL_CONF = require('../config/db')

// 创建链接对象
const connection = mysql.createConnection(MYSQL_CONF)

// 开始链接
connection.connect()

// 统一执行 sql 语句的函数
function execSQL(sql) {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if(err) {
        reject(err)
        return
      }

      resolve(result)
    })
  })

  return promise
}

module.exports = execSQL
