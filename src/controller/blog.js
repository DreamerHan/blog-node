const execSQL = require('../db/mysql.js')

const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1 `

  if(author) {
    sql += `and author='${author}' `
  }

  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }

  sql += `order by createtime desc;`

  return execSQL(sql)
}

// 博客详情
const getDetail = async (id) => {
  const sql = `select * from blogs where id=${id}`;
  const result = await execSQL(sql)
  return result[0]
}

// 新建博客
const newBlog = async (blogData = {}) => {
  const { title, content, author } = blogData
  const createtime = Date.now()

  const sql = `
    INSERT INTO blogs (title, content, createtime, author)
    values ('${title}', '${content}', ${createtime}, '${author}')
  `;

  const result = await execSQL(sql)
  
  return { id: result.insertId }
}

// 更新博客
const updateBlog = (blogData = {}) => {
  const { title, content, id } = blogData
  
  const sql = `
    UPDATE blogs SET title='${title}', content='${content}' 
    where id=${id}
  `

  return execSQL(sql).then(data => {
    if(data.affectedRows) {
      return {
        state: true
      }
    } else {
      return {
        state: false
      }
    }
  })
}

// 删除博客
const deleteBlog = (blogData = {}) => {
  const { id, author } = blogData
  
  const sql = `
    DELETE FROM blogs WHERE id='${id}' and author='${author}'
  `
  return execSQL(sql).then(data => {
    if(data.affectedRows) {
      return {
        state: true
      }
    } else {
      return {
        state: false
      }
    }
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}