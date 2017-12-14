var express = require('express');
var app = express();

var session = require('express-session');
var cookieParser = require('cookie-parser');

//静态文件访问
app.use('/public',express.static('public'));
//session
app.use(session({
    resave: false, //添加 resave 选项
    saveUninitialized: true,//添加 saveUninitialized 选项
    secret:'localhost',
    cookie: { maxAge: 60000}
}))
//cookie
app.use(cookieParser('zhoulei'))

var route_login = require(process.cwd()+'/colltroller/login');
var home_login = require(process.cwd()+'/colltroller/home');
var jy_router = require(process.cwd()+'/colltroller/jy');
app.use('/login',route_login);
app.use('/home',home_login);
app.use('/gt',jy_router);

//500   &    404
//test
app.get('/',function (req,res) {

    //加密cookie
    res.cookie('admin', { 'id': 1 }, {
            'signed': true
        }
    );

//获取设置的cookie
    var admin = req.signedCookies;

    // res.clearCookie('user3')
    res.send(admin)
    console.log(admin)
})
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke 500!');
});


app.use(function (req, res) {
    res.status(404).send('NOT FOUND 404!')
})

var server = app.listen(3030,function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Demo express base,listening at %s:%s',host,port);
})