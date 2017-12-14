module.exports =  function dotRouter(app){

    // session
    app.get('/',function(req,res,next){
        console.log(req.session.id)
        if(req.session.views){
            req.session.views++
            res.setHeader('Content-Type', 'text/html')
            res.write('<p>views: ' + req.session.views + '</p>')
            res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
            res.end()
        }else{
            req.session.views = 1
            res.end('这是一个session的例子。welcome to the session demo. refresh!')
        }
    })



    // dot
    app.get('/index',function(req,res,next){
        res.render('index',{fromServer: 'Hello from server'});
    })
    app.get('/me',function(req,res,next){
        res.render('me');
    })
}
