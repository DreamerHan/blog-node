const querystring = require("querystring");

module.exports = (req) => {
  const [path, query] = req.url.split("?");

  req.path = path;
  req.query = query && querystring.parse(query);
};
