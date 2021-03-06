function responseInfo(res, options){
  let config = Object.assign({
    code: 0,
    condeText: 'Ok!'
  }, options);
  // 发送相应数据
  res.status(200).type('application/json').send(config)
}

module.exports = {
  responseInfo
};