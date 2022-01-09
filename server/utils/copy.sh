#!/bin/sh

# 进入到日志
cd /Users/hanzhizhen/code-study/pro-blog-node/server/logs

# 拷贝 access.log 到 日期.access.log 文件中
cp access.log $(date +%Y-%m-%d).access.log

#清空 access.log
echo "" > access.log