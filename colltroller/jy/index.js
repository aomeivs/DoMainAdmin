var express = require('express');
var Geetest = require('gt3-sdk');
var formidable = require('formidable');
var form = new formidable.IncomingForm();
var jy_router = express.Router();
jy_router.get('/register-slide',function (req,res) {

    var captcha = new Geetest({
        geetest_id: '5e174f6501b7065ad74c04290fc8e4c9',
        geetest_key: '134f5122c28d5bf0aa2b4461c945017a'
    });

    captcha.register(null, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        if (!data.success) {
            // 进入 fallback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
            // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址
            // 为以防万一，你可以选择以下两种方式之一：
            // 1. 继续使用极验提供的failback备用方案
            req.session.fallback = true;
            res.send(data);

            // 2. 使用自己提供的备用方案
            // todo
        } else {
            // 正常模式
            req.session.fallback = false;
            res.send(data);
        }
    });

})



module.exports=jy_router;
