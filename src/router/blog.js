const { 
  getList, 
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 从 redis 中获取登录状态
const { redisGet } = require('../db/redis')

async function loginCheck(req) {
  const [err, data] = await redisGet('session')
  
  if(err || !data[req.cookie.userid]) {
    return new ErrorModel("你还没有登录哦~")
  }
} 

const handleBlogRouter = async (req, res) => {
  const { method } = req

  // 获取博客列表
  if(method === 'GET' && req.path === '/api/blog/list') {
    const { author = '', keyword = '' } = req.query
    const result = await getList(author, keyword)
  
    return new SuccessModel(result, 'OK')
  }

  // 博客详情
  if(method === 'GET' && req.path === '/api/blog/detail') {
    const { id } = req.query
    const result = await getDetail(id)

    return new SuccessModel(result, 'OK')
  }

  // 新建 博客
  if(method === 'POST' && req.path === '/api/blog/new') {
    // 如果未登录，loginState 才有值
    const loginState = await loginCheck(req)
    if(loginState) {
      return loginState
    }

    const result = await newBlog(req.body)

    return new SuccessModel(result, 'OK')
  }


  // 更新 博客
  if(method === 'POST' && req.path === '/api/blog/update') {
    
    // 如果未登录，loginState 才有值
    const loginState = await loginCheck(req)
    if(loginState) {
      return loginState
    }
    
    const result = await updateBlog(req.body)
    
    if (result.state) {
      return new SuccessModel(result, 'OK')
    } else {
      return new ErrorModel('更新博客失败')
    }
  }

  // 删除 博客
  if(method === 'POST' && req.path === '/api/blog/del') {

    // 如果未登录，loginState 才有值
    const loginState = await loginCheck(req)
    if(loginState) {
      return loginState
    }

    const result = await deleteBlog(req.body)

    if (result.state) {
      return new SuccessModel(result, 'OK')
    } else {
      return new ErrorModel('删除博客失败')
    }
  }
}

module.exports = handleBlogRouter