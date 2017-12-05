var express = require('express');
var app = express();
var formidable = require('formidable');
var route_login = express.Router();

    


route_login.get('/',function (req,res) {
    console.log('success')
    res.redirect('/public/io.html')
})



module.exports=route_login;
