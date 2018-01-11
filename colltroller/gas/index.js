
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
    let data = [
        {
            name:'1',
            n2:'2',
            n3:'3'
        }
    ];
    res.json(data)
})
gas_path.get('/api/create',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        db.gasDB.insert(fields.data, function (err, newDocs) {
            res.status(200).json(newDocs)
        });
    })
    
})

module.exports=gas_path;