const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 要读取的文件名路径
const filepath = path.join(__dirname, "../logs", "access.log");

// 创建 read stream
const readStream = fs.createReadStream(filepath);

// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream,
});

let chromeNum = 0;
let allNum = 0;

// 逐行读取
rl.on("line", (lineData) => {
  if (!lineData) {
    return;
  }

  // 记录总行数
  allNum++;

  // 日志信息格式是 method -- url -- userAgent -- Date
  // 所以使用 -- 来切分字符串
  const arr = lineData.split(" -- ");
  if (arr[2].indexOf("Chrome") > 0) {
    chromeNum++;
  }
});

// 监听读取完成
rl.on("close", () => {
  console.log(`Chrome 占比: ${Math.round(chromeNum / allNum) * 100}%`);
});
