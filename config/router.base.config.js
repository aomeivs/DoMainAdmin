module.exports =  function appRouter(app){

    // localhost:port/domain
    app.use('/domain',require(process.cwd()+'/colltroller/domain'));
    // io-socket
    // app.use('/io',require(process.cwd()+'/colltroller/io'));

    // dot,session测试
    require(process.cwd()+'/colltroller/dotDemo')(app);
        //500   &    404
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke 500!');
    });
    app.use(function (req, res) {
        res.status(404).send('NOT FOUND 404!')
    })
}