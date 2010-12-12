var express = require('express'),
    io = require('socket.io'),
    log = require('util').log,
    workhorse = require('./lib/workhorse_socket_server').create();

// Add a simple problem for testing
workhorse.postProblem(
    'add_two_numbers',
    'adder',
    {a:1, b:3},
    function(err) {
        if(err) {
            throw err;
        }
        else {
            log('Posted a problem');
        }
    },
    function(solution) {
        log('Got a solution in the callback:', solution);
    });

var app = express.createServer();
app.use(express.staticProvider(__dirname + '/public'));
app.use('/solvers', express.staticProvider(__dirname + '/solvers'));
app.get('/', function(req, res){
    res.render('index.html.ejs');
});

app.listen(3000);

var socket = io.listen(app);
workhorse.listen({socket:socket});
