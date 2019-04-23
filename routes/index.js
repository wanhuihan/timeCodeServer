var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");

var router = express()

// /* GET home page. */

// // function secret(req, res, next) {
// //   console.log('Accessing the secret section ...', req.cookies)
// //   next() // pass control to the next handler
// //
// // }
// //
// app.use(cookieParser('secret'));
// //
// // app.use(secret);

// // app.use(function (req, res, next) {
// //   console.log(req.signedCookies); // chyingp
// //   next();
// // });
//设置允许跨域访问该服务.
router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

var conn = mongoose.connect('mongodb://localhost/timecode');

var db = mongoose.connection;
db.on('error', function callback() { //监听是否有异常
  console.log("Connection error");
});
db.once('open', function callback() { //监听一次打开
  //在这里创建你的模式和模型
  console.log('connected!');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

var UsersSchema = new mongoose.Schema({
    EnglishName: String,
    department: String,
    ChineseName: String,
    Role: String,
    Task: String,
    comments: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

//每次执行都会调用,时间更新操作
UsersSchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }

    next();
})

//查询的静态方法
UsersSchema.statics = {
    fetch: function(cb) { //查询所有数据
        return this
          .find()
          .sort('meta.updateAt') //排序
          .exec(cb) //回调
    },
    findById: function(id, cb) { //根据id查询单条数据
        return this
          .findOne({_id: id})
          .exec(cb)
    }
}

router.use(cookieParser('123456'));

//
let Users = mongoose.model('Users', UsersSchema);

// app.use(function (req, res, next) {
//   // res.cookie('userinfo','hahaha',{maxAge:900000,httpOnly:true,signed:true});
//   // // console.log(req.signedCookies.nick); // chyingp
//   // next();
// });

// app.use(function (req, res, next) {
//   // 传入第三个参数 {signed: true}，表示要对cookie进行摘要计算
//   // res.cookie('nick', 'chyingp', {signed: true});
//   console.log(req, res)
//   res.end('ok');
// });

router.get('/',(req,res) => {
    res.send(`获取到的cookie值为：${req.signedCookies.username}`)
})

router.get("/user", function(req, res, next) {
    res.cookie('username','muzidigbig1',{maxAge:6000000,signed:true})
    //
    Users.fetch((err, users) => {
    	if (err) {}
    	res.json({data: users})
    })
})
//
router.post("/user", function(req, res) {
	//
	const user = {
		EnglishName: "Jack",
		department: "Dev",
		ChineseName: "Han Jack",
		Task: "here is the first comment",
		comments: "this is..."
	};

	new Users(user).save().then(data => {
		res.json(data)
	})
     // MongoClient.connect('mongodb://localhost',function(err,db){
     //    db.collection('timecode').insertOne({"name":"张三"},function(err,result){

     //        db.close() //关闭连接
     //    })
     // })
     // res.send('123')
})
router.listen(8001)
module.exports = router;
