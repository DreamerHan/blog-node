// 设置 cookie 过期时间
function setCookieExpires() {
  const d = new Date();
  // 在当前时间加上24小时
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

  // toGMTString 的格式：Sat, 11 Dec 2021 04:51:51 GMT
  return d.toGMTString();
}

module.exports = setCookieExpires;
