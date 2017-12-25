var nodemailer  = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var wellknown = require("nodemailer-wellknown");
var config = wellknown("QQ");
config.auth = {
    user:'zhou.lei.qingdao@qq.com',
    pass:'muiqjruuqqnibfda'
}
var mailOptions = {
    from:"zhou.lei.qingdao<zhou.lei.qingdao@qq.com>",
    to:"zhou.lei.qingdao@qq.com",
    subject:"域名过期提醒-zhou.lei.qingdao",
    text:"text plain",
    html:"<div>div content</div>"
};
var transporter = nodemailer.createTransport(smtpTransport(config));
var express = require('express');
var app = express();
var formidable = require('formidable');
var domain_path = express.Router();
var moment = require("moment");
// var Datastore = require('nedb')
var Datastore = require('nedb')
, db = {};
db.domainDB = new Datastore({ filename: process.cwd()+'/datafile/domainDB.db'});
db.userDB = new Datastore({ filename: process.cwd()+'/datafile/userDB.db'});
db.userDB.loadDatabase();
db.domainDB.loadDatabase();
//   自动压缩
// db.domain.persistence.setAutocompactionInterval(5000);
//   db.domain.insert(require(__dirname+'/datafile/domainDB'), function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
    // console.log(newDocs);
//   });
// domain_path.use('*',function(req,res,next){
    
// })



// setInterval(function(){    
    var docs = db['domainDB'].find({isExpired:"false"/* ,sendMsg:0,expireDate:{$lt:expireDate30} */},function(err,docs){

        // send mail with defined transport object
        if(err || docs.length==0) return;
            for(let doc of docs){
                if(moment(doc.expireDate).valueOf()-moment(new Date()).valueOf()>0){
                    var tempDay = moment(moment(doc.expireDate).valueOf()-moment(new Date()).valueOf()).dayOfYear();
                    if(tempDay<=30&&tempDay>7&&doc.sendMsg=="0"){
                        repeatMethod(mailOptions,doc,tempDay);
                    }else if(tempDay<=7&&tempDay>1&&doc.sendMsg=="1"){
                        doc.sendMsg="2";
                        repeatMethod(mailOptions,doc,tempDay);
                    }else if(tempDay<=1){
                        doc.sendMsg="3";
                        repeatMethod(mailOptions,doc,tempDay);
                    }
                }else{
                    doc.isExpired="true";
                }
            }
            
    })
    function repeatMethod(mailOptions,doc,tempDay){
        mailOptions.html=
                        `
                        <div>
                            域名：${JSON.stringify(doc.domain)} ，还有${tempDay}天到期，续费金额${doc.renewFree}
                        </div>
                        `
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        }); 
        update(doc).then(function(num){
            if(num){
                console.log('更新成功',doc.domain)
            }else{
                console.log('更新失败',doc.domain)
            }
            
        })
    }
// },1000*60*60*24)
// 主页面，使用render、express模板渲染html
domain_path.get('/',require('./isLogin').checkLogin,function (req,res) {
    
    // console.log(db.domain.find({}))
    /*  db.domain.find({},function(err,docs){
        res.render('domain/index',{array:docs,moment: require("moment")})
    }) */
    /*     
    // 一次进行多个查询汇总
    Promise.all([find({}),find({})])
    .then(function(values){
        console.log(values)
    }) */

    find({},'domainDB').then(function(data){
        res.render('domain/index',{array:data,moment:moment})
    })
})
// 使用api方式获取数据
domain_path.get('/api/find',function (req,res) {
    find({},'domainDB').then(function(data){
        res.status(200).json(data)
    })
})
// 使用api方式更新数据
domain_path.post('/api/update',function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        update(fields.data).then(function(data){
            res.status(200).json(data)
        })
    })
})

domain_path.get('/signin',function(req,res,next){
    res.render('domain/signin')
})

domain_path.post('/api/signin',function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        db['userDB'].find({user:fields.data.user,password:fields.data.password},function(err,docs){
            if(docs.length>0){
                req.session.user = docs[0];
                res.status(200).json({msg:false})
            }else{
                res.status(200).json({msg:'用户名或密码错误！'})
            }
        })
    })
})

domain_path.get('/api/signout',function(req,res,next){
    req.session.user=null;
    res.redirect('/domain');
})

domain_path.get('/api/insertField',function(req,res,next){
    db['domainDB'].update({},{$set:{sendMsg:"0"}},{multi:true},function(err,num){
        console.log(num);
        next();
    })
})

/**
 * 根据查询条件params及表名dbName查询结果
 * 
 * @param {any} params 
 * @param {any} dbName 
 * @returns 
 */
var find = function(params,dbName){
    //
	return new Promise(function(resolve,reject){
        db[dbName].find(params,function(err,docs){
            if(docs){
                resolve(docs);
            }else{
                reject(err);
            }
        })
	})
}
var update = function(params){
	return new Promise(function(resolve,reject){
        var _id = params._id;
        delete params._id;
        db['domainDB'].update({'_id':_id},{$set:params}, { upsert: true },function(err,numReplaced,docs,upsert){
            if(numReplaced){
                resolve(numReplaced);
            }else{
                reject(err);
            }
        })
	})
}

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(3000);
        }, time);
    })
};

var start = async function () {
    // 在这里使用起来就像同步代码那样直观
    console.log('start');
    await sleep(3000);
    console.log('end');
};

// start();





module.exports=domain_path;