const { execSQL } = require("../db/mysql");
const generatePassword = require("../utils/cryp");

// 登录
const login = async ({ username, password }) => {
  password = generatePassword(password);

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
