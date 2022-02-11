const User = require("../db/models/User");
const generatePassword = require("../utils/cryp");

// 登录
const login = async ({ username, password }) => {
  password = generatePassword(password);

  const result = await User.find({
    username,
    password,
  });

  console.log(result);

  return result.length === 0 ? undefined : result[0];
};

module.exports = {
  login,
};
