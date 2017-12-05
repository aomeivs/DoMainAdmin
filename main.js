var express = require('express');
var app = express();
var path = require('path');
// dot engine
var engine = require('express-dot-engine');
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dot');
engine.settings.dot = require(__dirname+'/dot.config');



var session = require('express-session');
NedbStore = require('connect-nedb-session')(session);
app.use(session(
    { 
 /*        genid: function(req) {
            return 'uuid' // use UUIDs for session IDs，可以追踪用户ID
        }, */
        secret: 'yoursecret', 
        key: 'yoursessionkey',
        saveUninitialized:false, 
        resave:false,
        cookie: { 
            path: '/' , 
            httpOnly: true, 
            maxAge: 1000 * 1000 ,  // One year for example
            // expires:1000
        }, 
        store: new NedbStore({ filename: 'datafile/path_to_nedb_persistence_file.db' })
    }
));


var cookieParser = require('cookie-parser');

//静态文件访问
app.use('/public',express.static('public'));


// var io_router = require(process.cwd()+'/colltroller/io');
var domain_router = require(process.cwd()+'/colltroller/domain');

app.get('/',function(req,res,next){
    console.log(req.session.id)
    if(req.session.views){
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    }else{
        req.session.views = 1
        res.end('这是一个session的例子。welcome to the session demo. refresh!')
    }
})

// dot 定义属性
engine.helper.myHelperProperty = 'Hello from server property helper';
// dot 定义方法
engine.helper.myHelperMethod = function(param) {
 // you have access to the server model 
 var message = this.model.fromServer;
 // .. any logic you want 
 return 'Server model: ' + message;
}

app.get('/index',function(req,res,next){
    res.render('index',{fromServer: 'Hello from server'});
})
app.get('/me',function(req,res,next){
    res.render('me');
})

// domain
app.use('/domain',domain_router);



// io-socket
// app.use('/io',io_router);

//500   &    404
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
// require('./io_server').listen(server)