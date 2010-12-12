var express = require('express'),
    io = require('socket.io');

var app = express.createServer();
app.use(express.staticProvider(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('index.html.ejs');
});

app.listen(3000);

var socket = io.listen(app);
socket.on('connection', function(client){
    console.log('Client connected: ' + client);
    client.on('message', function(){ console.log('Got message from client.'); });
    client.on('disconnect', function(){ console.log('Client disconnected.'); });
});
