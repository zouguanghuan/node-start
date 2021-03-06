const mysql = require('mysqls')

const connecttion = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '123456',
  database: 'zouguanghuan'
})

connecttion.connect()

module.exports={
  connecttion
}