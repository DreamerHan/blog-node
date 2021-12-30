const execSQL = require("../db/mysql");

const login = (loginInfo) => {
  const { username, password } = loginInfo;

  const sql = `
    select * from users 
    where username='${username}' and password='${password}'
  `;

  return execSQL(sql).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = {
  login,
};
