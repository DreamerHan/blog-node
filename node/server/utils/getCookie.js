// 解析 cookie
module.exports = (req) => {
  req.cookie = {};

  const cookieStr = req.headers.cookie || "";

  cookieStr.split("; ").forEach((item) => {
    // 不存在就 return，否则会产生 {"": undefined} 的数据
    if (!item) {
      return;
    }
    const [key, value] = item.split("=");
    req.cookie[key] = value;
  });
};
