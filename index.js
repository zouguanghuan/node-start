const express =require('express'),
mime = require('mime'),
qs = require('qs'),
bodyParser = require('body-parser')
// 监听，处理请求全部基于app走
app = express();
      
// 导入自己写的插件
const {responseInfo} = require('./util/util')
const { readFile, writeFile } = require('./myFs/myFs')
const config = require('./config');
const { urlencoded } = require('express');
      
//创建服务监听端口号
app.listen(config.port, ()=>{
  console.log('监听端口为',config.port)
})
// 中间件，在处理请求之前统一做的事情
app.use(bodyParser.urlencoded({
  // 把请求主体传递的信息 x-www-form-urlencoded编程键值对的形式存储到req.body
  extended: false
}));

app.use(async (req, res, next)=>{
  // 将读取结果挂载到req
  req.USER_DATA = await readFile('./mock/user.json', 'utf8');
  req.USER_DATA = await JSON.parse(req.USER_DATA);
  next()
})

// 静态文件处理
app.use(express.static('./static'));


// API接口请求处理
app.get('/user', (req, res)=>{
  let { limit=10, page =1  } = req.query;
  let total = req.USER_DATA.length,
      pages = Math.ceil(total/limit),
      data = [];
  page = parseInt(page);
  limit = parseInt(limit)

  // 获取指定页面的信息
  for (let i = (page-1)*limit; i<page*limit; i++){
    let item =  req.USER_DATA[i];
    if(!item) {
      break;
    }
    data.push(item)
  }

  if(data.length === 0) {
    responseInfo(res,{
      code: 1,
      codeText:'没有匹配的数据'
    });
    return
  }
  responseInfo(res, {
    page,
    limit,
    pages,
    total,
    data
  });
});

app.post('/user/add', (req, res)=>{
  let {name, age} = req.body;
  req.USER_DATA.push({
    id: req.USER_DATA.length === 0 ? 1 : req.USER_DATA[req.USER_DATA.length-1]['id']+1,
    name,
    age
  });
  writeFile('./mock/user.json',req.USER_DATA)
  .then(_=>{
    responseInfo(res)
  }).catch(_=>{
    responseInfo(res, {
      code: 1,
      codeText: '添加失败'
    })
  });

});


// 请求资源不存在的处理
app.use((req, res)=>{
  res.status(404).send({
    code:1,
    condeText: 'not found'
  })
});