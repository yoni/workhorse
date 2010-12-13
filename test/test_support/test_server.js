var express = require('express'),
    io = require('socket.io'),
    log = require('../../lib/logger').log,
    wh = require('../../workhorse'),
    soda = require('soda');

function setUpWorkhorseServer(port) {
    var workhorse = wh.create();

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
        app.set('views', __dirname + '/../../views');
    });
    app.use(express.staticProvider(__dirname + '/../../public'));
    app.use('/solvers', express.staticProvider(__dirname + '/../../solvers'));
    app.get('/', function(req, res){
        res.render('index.html.ejs');
    });
    app.listen(port);

    var socket = io.listen(app);
    workhorse.listen(socket);

    log('Workhorse server running on http://localhost:' + port);

    return {
        workhorse: workhorse,
        app: app
    };
}

module.exports.setUpWorkhorseServer = setUpWorkhorseServer;
