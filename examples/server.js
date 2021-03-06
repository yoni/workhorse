var express = require('express'),
    io = require('socket.io'),
    log = require('util').log,
    workhorse = require('../workhorse').create();

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
app.configure(function(){
    app.set('views', '../views');
});
app.use(express.staticProvider('../public'));
app.use('/solvers', express.staticProvider('../solvers'));

app.get('/', function(req, res){
    res.render('index.html.ejs');
});

app.listen(3000);

var socket = io.listen(app);
workhorse.listen(socket);

log('Workhorse server running on http://localhost:3000');
