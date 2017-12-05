let io = require('socket.io')();
io.on("connection",function(socket){
    /* console.log(_socket.id+':connection')
    _socket.on('message',function(msg){
        console.log('Message Received: %s',msg)
        _socket.broadcast.emit('message',msg)
    }) */
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    setTimeout(function(){
        socket.broadcast.emit("msg",{data:"hello,everyone"}); 
    },1000)

})

exports.listen = function(_server){
    
    return io.listen(_server)
}