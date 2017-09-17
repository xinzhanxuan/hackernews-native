// 封装一个 context 模块（上下文模块）
// 这个模块的主要作用：
// 1. 为 req 添加一个 query 属性（通过 query 属性就可以获取用户 get 提交的数据）
// 2. 为 req 添加一个 pathname 属性 （通过 pathname 可以获取用户请求的 url（不包含查询字符串））
// /add?id=11&name=fdsf
// 3. 为 res 添加一个 render() 函数，这个函数作用就是读取响应资源文件并返回（做渲染操作）



// 当确定要封装（提取）一个模块时，该如何编写一个模块中的代码？
// 1. 思考：该模块中包含哪些代码？
// 2. 思考：这些代码是否用到了外部的数据（如果用到了外部的数据，那么要考虑如何把这些数据传递进来）
// 3. 思考：该模块要对外暴露哪些内容（module.exports 要赋什么值）



// 分析1：该模块中用到了外部的 req 和 res 对象，就要考虑将来要把这两个对象传递进来。
// 分析2：我们在该模块中对 req 和 res 扩展后，无需在单独把 req 和 res 返回，因为扩展了这两个对象后，外部引用的也是同样的对象，可以知己获取扩展的成员
// 此时 module.exports 该如何设置呢？
// module.exports = function (req, res) {};

console.log('4');
// 加载 url 模块
var url = require('url');
var fs = require('fs');
var _ = require('underscore');
var mime = require('mime');

module.exports = function(req, res) {
  // 通过 url 模块，解析用户输入的 url 路径
  var urlObj = url.parse(req.url.toLowerCase(), true);

  // 1. 为 req 添加一个 query 属性
  req.query = urlObj.query;

  // 2. 为 req 添加一个 pathname 属性
  req.pathname = urlObj.pathname;

  // 3. 为 res 添加一个 render 函数
  res.render = function(filename, tplData) {
    // 显示添加新闻页面
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.end('404, page not found');
        return;
      }

      // 进行模板数据替换，替换完毕后再渲染
      if (tplData) {
        // 如果有模板数据，那么就进行模板替换操作
        data = _.template(data.toString())(tplData);
      }

      res.setHeader('Content-Type', mime.lookup(filename));
      res.end(data);
    });

  };

};