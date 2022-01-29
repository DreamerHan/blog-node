const { SECRET_KEY } = require("../config/global");

// crypto 是 nodejs 自身提供的加密的库
const crypto = require("crypto");

// md5 加密
function md5(content) {
  let md5 = crypto.createHash("md5");

  // hex 是变成16进制的形式
  return md5.update(content).digest("hex");
}

function generatePassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;

  return md5(str);
}

module.exports = generatePassword;
