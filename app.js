
// 1. 加载 http 模块
var http = require('http');

// 加载上下文模块（用来扩展 req 和 res 对象）
var context = require('./context.js');
// 加载路由模块 （用来判断不同的路由操作）
var router = require('./router.js');
// 加载 config 模块（配置模块）
var config = require('./config.js');



console.log('1');

// 2. 创建 服务
var server = http.createServer(function(req, res) {

  console.log('2');
  // 调用 context 模块，扩展 req  和 res 对象
  context(req, res);

  // 调用 router 模块
  router(req, res);

});


// 3. 启动服务
server.listen(config.port, function() {
  console.log('http://localhost:' + config.port);
});
