var express = require('express');
var app = express();
var formidable = require('formidable');
var route_login = express.Router();



//

route_login.post('/',function (req,res) {
    //postman-测试不出来结果
console.log(app.locals)
    //创建表单上传
    var form = new formidable.IncomingForm();
//设置编辑
    form.encoding = 'utf-8';
//设置文件存储路径
    form.uploadDir = "public/upload/images";
//保留后缀
    form.keepExtensions = true;
//设置单文件大小限制
    form.maxFieldsSize = 2 * 1024 * 1024;


//form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req,function (err,fields, files) {
        console.log(req.session)
        var username = fields.username;
        // res.send('用户名：'+username+'  上传文件：'+files.file.name)

        res.cookie('cookiename','i am a cookie',{ maxAge: 200000,httpOnly:true, path:'/'})
        req.session.user=username;
        res.redirect('/home')
    });
})




//test  只在当前路径下有效果
route_login.get('/applocal',function (req,res) {
    // console.log(req.cookies)

    res.send(app.get('title'))
    // console.log(app.locals.title)
})

module.exports=route_login;
