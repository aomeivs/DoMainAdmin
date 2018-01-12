
var express = require('express');
var app = express();
var formidable = require('formidable');
var gas_path = express.Router();
var moment = require("moment");
var Datastore = require('nedb')
, db = {};
db.gasDB = new Datastore({ filename: process.cwd()+'/datafile/gasDB.db'});
db.gasDB.loadDatabase();


// 使用api方式获取数据
gas_path.get('/',function (req,res) {
    res.render('gas/index')
})
gas_path.get('/api/find',function (req,res) {
    db.gasDB.find({}).sort({ updatedAt: -1 }).exec(function(err,docs){
        res.json(docs)
    })
    
})
gas_path.post('/api/create',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        let gas = fields.gas;
        gas.createdAt = moment().format();
        gas.updatedAt = moment().format();
        db.gasDB.insert(gas, function (err, newDocs) {
            res.status(200).json(newDocs)
        });
    })
})
gas_path.post('/api/update',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        let gas = fields.gas;
        gas.updatedAt = moment().format();
        let id = gas._id;
        delete gas._id;
        db.gasDB.update({'_id':id},{$set:gas},{}, function (err, numReplaced) {
            res.status(200).json(numReplaced)
        });
    })
})
gas_path.post('/api/updateDocFiled',function(req,res){
    var form = new formidable.IncomingForm();
    let numReplaced = 0;
    form.parse(req,function(err,fields,files){
        let dataGAS = fields.dataGAS;
        for(let gas of dataGAS){
            gas.updatedAt = moment().format();
            let p92 = {
                "discount":gas.discount92,
                "date":gas.date
            }
            let p95 = {
                "discount":'',
                "date":''
            }
            let p98 = {
                "discount":'',
                "date":''
            }
            let p0 = {
                "discount":'',
                "date":''
            }
            gas.product={};
            gas.product.p92=p92
            gas.product.p95=p95
            gas.product.p98=p98
            gas.product.p0=p0
            let id = gas._id;
            delete gas._id;
            db.gasDB.update({'_id':id},{$set:gas},{}, function (err, num) {
                numReplaced=numReplaced+num;
            });
        }
    })
    res.status(200).json(numReplaced)
})
gas_path.get('/api/delete/:id',function(req,res){
    let id = req.params.id;
    db.gasDB.remove({_id:id},{}, function (err, numRemoved) {
        res.status(200).json(numRemoved)
    });
})

module.exports=gas_path;