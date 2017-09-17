// 路由模块
// 作用：封装所有路由判断（就是通过 if-else 判断请求方法和请求路径的代码）

// 1. 该模块中包含什么代码
// 2. 这些代码中有用到外部的数据吗？
// 3. 该模块的 module.exports 要返回什么

console.log('6');

// 加载业务模块
var handler = require('./handler.js');

module.exports = function(req, res) {
  // 把所有的请求方法都转换为小写
  var method = req.method.toLowerCase();
  // 处理用户请求 /favicon.ico 的问题
  req.pathname = (req.pathname === '/favicon.ico') ? '/resources/images/y18.gif' : req.pathname;

  // 写代码判断路由
  if ((req.pathname === '/index' || req.pathname === '/') && method === 'get') {
    // 调用业务模块中的方法来处理请求
    handler.index(req, res);
  } else if (req.pathname === '/details' && method === 'get') {
    handler.details(req, res);
  } else if (req.pathname === '/submit' && method === 'get') {
    handler.submit(req, res);
  } else if (req.pathname === '/add' && method === 'get') {
    handler.get.add(req, res);
  } else if (req.pathname === '/add' && method === 'post') {
    handler.post.add(req, res);
  } else if (req.pathname.startsWith('/resources') && method === 'get') {
    handler.statics(req, res);
  } else {
    handler.errorHandler(req, res);
  }
};