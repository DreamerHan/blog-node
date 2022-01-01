const querystring = require("querystring");

module.exports = (req) => {
  const [path, query] = req.url.split("?");

  req.path = path;

  // [注意] 如果没有query参数，req.query 会为 undefined
  // 后续从 req.query 结构赋值参数时，undefined 会导致报错的，所以最好设置默认值为 {}
  req.query = query ? querystring.parse(query) : {};
};
