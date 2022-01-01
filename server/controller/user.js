const loginIn = (loginInfo) => {
  const { username, password } = loginInfo;

  // 模拟数据
  if (username === "zhangsan" && password === "123") {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  loginIn,
};
