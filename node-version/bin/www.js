const http = require("http");

// 这里将对 req/res 的具体处理进行模块化业务逻辑抽离
const serverHandler = require("../app");

const server = http.createServer(serverHandler);

server.listen(3000, () => {
  console.log("Server is running at port 3000");
});
