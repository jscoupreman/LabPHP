var http = require('http');

httpServer = http.createServer(function(request, result){
    //console.log('A new user has been requested a page');
    //result.end('Hello World');
});
httpServer.listen(8080);

var io = require('socket.io').listen(httpServer);
var users = {};
io.sockets.on('connection', function(socket){
    var me = false;
    
    for(var k in users){
        socket.emit('getUsers', users[k]);
    }
    
    socket.on('login', function(user){
        console.log('New connection requested for user : ' + user.login);
        me = user;
        me.id = me.login + me.password;
        //socket.emit('newUser'); //current user
        //socket.broadcast.emit('newUser'); // other users
        io.sockets.emit('newUser', me); // all users
        users[me.id] = me;
    });
    
    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disconnectedUser', me);
    });
});