$(function(){
    var socket = io.connect('http://localhost:8080');
    
    $('#loginForm').submit(function(event){
        event.preventDefault();
        socket.emit('login', {
            login : $('#login').val(),
            password : $('#password').val()
        });
    });
    
    socket.on('newUser', function(user){
        console.log('new user : ' + user.login);
    });
    
    socket.on('getUsers', function(users){
        console.log('All users : ' + users);
    });
    
    socket.on('disconnectedUser', function(user){
        console.log('A user has been disconnected : ' + user.login);
    });
    
    socket.emit('login', {
        login : "unLogin",
        password : "unPassword"
    });
    
    socket.emit('joinQueue');
    console.log('Joining queue');
});