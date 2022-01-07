const fs = require("fs");
const path = require("path");

// 生成一个 write stream
function createWriteStream(filename) {
  const fullFilename = path.join(__dirname, "../logs", filename);

  const writeStream = fs.createWriteStream(fullFilename, {
    flags: "a", // a 表示追加日志
  });

  return writeStream;
}

// 写日志
function writeLog(writeStream, log) {
  writeStream.write(log + "\n");
}

// 访问日志
const accessWriteStream = createWriteStream("access.log");
function accessLog(log) {
  writeLog(accessWriteStream, log);
}

// 错误日志
const errorWriteStream = createWriteStream("error.log");
function errorLog(log) {
  writeLog(errorWriteStream, log);
}

// 自定义事件日志
const eventWriteStream = createWriteStream("event.log");
function eventLog(log) {
  writeLog(eventWriteStream, log);
}

module.exports = {
  accessLog,
  errorLog,
  eventLog,
};
