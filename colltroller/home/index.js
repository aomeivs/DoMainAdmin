var express = require('express');
var app = express();
var home_login = express.Router();
home_login.get('/',function (req,res) {
    // app.locals.title='My App'
    // console.log(req.cookies)
    res.sendFile(process.cwd()+'/public/home/index.html')
    // console.log(app.locals.title)
})

home_login.get('/applocal',function (req,res) {
    // console.log(req.cookies)
    res.send(app.get('title'))
    // console.log(app.locals.title)
})


module.exports=home_login;
