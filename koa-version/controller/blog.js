const { execSQL } = require("../db/mysql");

// 防止 XSS 攻击
const xss = require('xss')

// 最好不要从参数里直接结构，因为如果调用时没有传参，就会导致报错
// 这里觉得最好的方式是用参数名获取参数，并且给参数设置默认值,这样后续的解构赋值不会因为漏传参数而导致报错
const getList = async (params = {}) => {
  const { author = "", keyword = "" } = params;

  let sql = `select * from blogs where 1=1 `;

  // keyword 不知道怎么用 ？占位符处理
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }

  if (author) {
    sql += `and author=? `;
  }
  
  sql += `order by createtime desc;`;
  
  const [err, result] = await execSQL(sql, [`${author}`]);

  return err ? undefined : result;
};

// 博客详情
const getDetail = async (id) => {
  const sql = `select * from blogs where id=?`;

  const [err, result] = await execSQL(sql, [`${id}`]);

  return err ? undefined : result;
};

// 新建博客
const newBlog = async (blogData = {}) => {
  // blogData 是一个博客信息对象，包含 title content 等属性
  const { title, content, author } = blogData;
    
  const createtime = Date.now();

  const sql = `
    INSERT INTO blogs (title, content, createtime, author)
    values (?,?,?,?)
  `;

  // 对于创建后可能会展示到页面上的数据进行 xss 漏洞修复
  const values = [`${xss(title)}`, `${xss(content)}`, createtime, `${xss(author)}`]

  const [err, result] = await execSQL(sql, values);

  return err ? undefined : { id: result.insertId };
};

// 更新博客
const updateBlog = async (blogData = {}) => {
  // blogData 是一个博客信息对象，包含 title content 等属性
  const { title, content, id } = blogData;

  const sql = `UPDATE blogs SET title=?, content=? where id=?`;


  // 对于创建后可能会展示到页面上的数据进行 xss 漏洞修复
  const values = [`${xss(title)}`, `${xss(content)}`, `${id}`]

  const [err, result] = await execSQL(sql, values);

  return err ? undefined : result.affectedRows;
};

// 删除 博客
const deleteBlog = async (blogData = {}) => {
  const { id, author } = blogData;

  const sql = `DELETE FROM blogs WHERE id=? and author=?`;

  const values = [`${id}`, `${author}`]

  const [err, result] = await execSQL(sql, values);

  return err ? undefined : result.affectedRows;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
