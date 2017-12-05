var express = require('express');
var app = express();
var formidable = require('formidable');
var domain_path = express.Router();

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
        res.render('domain/index',{array:data,moment: require("moment")})
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
    db['domainDB'].update({},{$set:{renewFree:0}},{multi:true},function(err,num){
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