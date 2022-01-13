const { execSQL } = require("../db/mysql");

const login = async (loginInfo) => {
  const { username, password } = loginInfo;

  const sql = `
    select * from users 
    where username=? and password=?
  `;

  const [err, result] = await execSQL(sql, [`${username}`, `${password}`]);

  return err ? undefined : result[0];
};

module.exports = {
  login,
};
