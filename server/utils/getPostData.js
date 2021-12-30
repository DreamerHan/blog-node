module.exports = (req) => {
  return new Promise((resolve, reject) => {
    let postData = "";
    const { method, headers } = req;

    if (method === "POST" && headers["content-type"] === "application/json") {
      req.on("data", (data) => {
        postData += data.toString();
      });

      req.on("end", () => {
        req.body = postData ? JSON.parse(postData) : {};

        resolve();
      });
    }
  });
};
