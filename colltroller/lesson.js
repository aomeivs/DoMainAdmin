
//全部过滤
app.all('/secret',function (req,res,next) {
    console.log('at / 都会走这里！');
    next();
})

app.get('/',function (req, res) {
    res.send('Hello world A!')
});
app.get('/user/:id?',function (req, res) {
    res.send('/user/:id?'+req.params.id)
});
app.post('/',function (req, res) {
    res.send('Got a POST request!')
})

app.put('/user',function (req, res) {
    res.send('Got a PUT request at /user!')
})

app.delete('/user',function (req, res) {
    res.send('Got a DELETE request at /user!')
})




//路由句柄回调
app.get('/demo/b',function (req, res, next) {
    console.log('/demo/b 开始处理....');
    next();
},function (req, res) {
    console.log('/demo/b处理完，给我了！');
    res.status(200).sendFile(__dirname+'/main.html');
    // res.send('/demo/b处理完，给我了！')
})


//express route()


app.route('/route').get(function (req, res) {
    res.send('/route GET request!')
}).post(function (req, res) {
    res.send('/route POST request!')
})


var router = express.Router();

router.use(function timeLog(req,res,next) {
    console.log('开始计时Time: ',Date.now());
    next();
})

router.get('/',function (req, res) {
    res.send('/router GET request')
    console.log('完成计时Time: ',Date.now());
})

app.use('/router',router);



var birds = express.Router();

birds.use(function timeLog(req,res,next) {
    console.log('birds开始计时Time: ',Date.now());
    next();
})

birds.get('/',function (req, res) {
    res.send('/birds GET request')
    console.log('birds完成计时Time: ',Date.now());
})

app.use('/birds',birds);


