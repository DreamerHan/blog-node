// post 数据获取
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({})
      return
    }

    // 不是 json 的数据形式，先忽略
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', data => {
      postData += data.toString()
    })

    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }

      resolve(
        JSON.parse(postData)
      )
    })
  })

  return promise
}

module.exports = getPostData