// 最好不要从参数里直接结构，因为如果调用时没有传参，就会导致报错
// 这里觉得最好的方式是用参数名获取参数，并且给参数设置默认值,这样后续的解构赋值不会因为漏传参数而导致报错
const getList = (params = {}) => {
  const { author = "", keyword = "" } = params;
  return [
    {
      id: 1,
      title: "这是 title",
      content: "这是内容",
      createTime: "1638747351836",
      author: "hanzhizhen",
    },
  ];
};

const getDetail = (id) => {
  return {
    id: id,
    title: id + "的标题",
    content: id + " 的内容, 内容",
    createTime: 1636373098955,
    author: "zhangsan",
  };
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客信息对象，包含 title content 等属性
  return {
    id: 3,
    title: "新的博客标题",
  };
};

const updateBlog = (blogData = {}) => {
  // blogData 是一个博客信息对象，包含 title content 等属性
  const { id } = blogData;

  return {
    id,
    state: true,
    msg: id + " 博客标题更新",
  };
};

const deleteBlog = (blogData = {}) => {
  const { id } = blogData;
  return true;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
