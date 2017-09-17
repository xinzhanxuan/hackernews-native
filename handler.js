// 业务模块
// 作用：对于不同的请求（路由），实现不同的业务处理
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var config = require('./config.js');

console.log('5');

// 处理用户请求 /index 的业务
module.exports.index = function(req, res) {
  // 1. 读取 data.json 中的数据
  read_data(function(list) {
    // 2. 渲染
    // 读取 index.html 文件，进行模板替换
    res.render(path.join(__dirname, 'views', 'index.html'), { title: '新闻列表页', list: list });
  });
};


// 处理静态资源的方法
module.exports.statics = function(req, res) {
  // /resources/css/news.css
  // 表示用户请求的是静态资源
  // 如果请求的是静态资源，那么就直接根据用户请求的路径和 __dirname 拼接查找对应的资源即可。
  res.render(path.join(__dirname, req.pathname));
};


// 处理 details 请求
module.exports.details = function(req, res) {
  // 要显示新闻详情
  // 1. 获取用户请求的 id 
  var id = req.query.id;

  // 2. 读取 data.json 文件中的数据到一个 list 数组
  read_data(function(list) {

    var model;
    // 3. 遍历 list 数组中的数据，根据 id 找到这条新闻
    for (var i = 0; i < list.length; i++) {

      // 判断用户传递过来的 id，在 data.json 文件中是否存在，如果存在那么找到这条记录，并保存下来，然后 break
      if (list[i].id === parseInt(id)) {
        model = list[i];
        break;
      }
    }

    // 4. 调用 res.render() 方法渲染
    if (model) {
      // 进行渲染
      res.render(path.join(__dirname, 'views', 'details.html'), { model: model });
    } else {
      res.end('No such item.');
    }
  });
};


// 处理 /submit 请求
module.exports.submit = function (req, res) {
  // 显示添加新闻页面
  res.render(path.join(__dirname, 'views', 'submit.html'));
};


// 处理 404
module.exports.errorHandler = function (req, res) {
  res.end('404');
};


module.exports.get = {};
module.exports.get.add = function (req, res) {
  // 读取 data.json 文件中的数据
  read_data(function(list) {

    // 为每条新闻添加一个 id 属性
    req.query.id = list.length;
    // 将用户 get 提交过来的数据直接 push 到 list中
    list.push(req.query);

    // 把 list 数据写入到 data.json 文件中
    write_data(list, function() {

      // 3. 跳转到 /index 或 / 路径（首页）在文件保存成功后再执行跳转
      // 服务器端通过设置响应报文头，实现让浏览器自动跳转
      res.statusCode = 302;
      res.statusMessage = 'Found';
      res.setHeader('Location', '/');
      // 结束请求
      res.end();

    });
  });
};



module.exports.post = {};
module.exports.post.add = function (req, res) {
  // 1. 读取 data.json 文件中的数据
  read_data(function(list) {
    // 获取用户 post 提交的数据
    get_post_data(req, function(body) {

      // 为添加的新闻增加一个 id 属性
      body.id = list.length;
      // 并且把 post 提交的数据 push 到 list 中
      list.push(body);

      // 把 list 中的数据再写入到 data.json 文件中
      write_data(list, function() {
        res.statusCode = 302;
        res.statusMessage = 'Found';
        res.setHeader('Location', '/');
        // 结束请求
        res.end();
      });
    });

  });
};



// (封装读取 data.json 文件的代码)正确：
function read_data(callback) {

  fs.readFile(config.dataPath, 'utf8', function(err, data) {

    // 如果读取文件出错了，并且错误不是文件不存在那么就抛出异常
    // 如果是文件不存在，那么就不认为是出错了，此时data 就是 undefined
    if (err && err.code !== 'ENOENT') {
      throw err;
    }

    var list = JSON.parse(data || '[]');
    // 将读取到的数据 list, 返出去（传递出去）
    callback(list);
  });
}


// 封装写入 data.json 文件的代码
function write_data(list, callback) {

  fs.writeFile(config.dataPath, JSON.stringify(list), 'utf8', function(err) {
    if (err) {
      throw err;
    }

    // 当数据写入完毕后执行
    callback();
  });
}


// 封装获取用户 post 提交的数据的代码
function get_post_data(req, callback) {

  // 用来保存用户 每次 post 提交的数据
  var array = [];

  // 监听 request 的 data 事件
  // 回调函数的参数 chunk 表示一个块数据。是 Buffer 类型的对象
  req.on('data', function(chunk) {
    array.push(chunk);
  });


  // 再监听 request 的 end 事件
  // 当 end 事件被执行的时候，表示所有数据都提交完毕了
  req.on('end', function() {
    // 把 array 里面的 n 个 Buffer 对象编程 1个 Buffer对象
    // body 是一个 “大” buffer 对象
    var body = Buffer.concat(array);

    // 把用户提交过来的 数据（buffer）转成字符串
    body = body.toString('utf8');
    // console.log(body); // title=ddddd&url=dddddd&text=dddd

    // 通过调用 内置模块 querystring，把 查询字符串 转换为 json 对象
    body = querystring.parse(body);

    // 把 body 数据传递出去
    callback(body);
  });

}