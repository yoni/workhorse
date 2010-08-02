var connect = require('connect'),
    express = require('express');

function workhorse(args) {
  validateArgs(args);

  // initialize the app 
  var app = express.createServer(
      connect.logger(),       // log all requests
      connect.bodyDecoder()); // make the POST body available using req.body

  app.configure(function() {
      app.set('views', __dirname + '/views');
      app.use('/static', connect.staticProvider(__dirname + '/static'));
      app.use('/solvers', connect.staticProvider(__dirname + '/solvers'));
    });

  // routing
  app.get('/', function(req, res){
      res.render('index.html.ejs');
    });
  app.get('/problem', function(req,res){
      args.problem(function(problem) {
          res.send(problem);
        });
    });
  app.post('/solution', function(req,res){
      var solution = req.body.solution;
      var problem_id = req.body.problem_id;
      args.solution(solution, problem_id, function(text) {
          res.send(text);
        });
    });

  return app;
}

function validateArgs(args) {
  function validateFunctionArgument(args, name) {
    if(!args[name] || (typeof args[name] != 'function'))
      throw "Initialization error. Was expecting an argument '" + name + "' of type 'function'";
  }
  validateFunctionArgument(args, 'solution');
  validateFunctionArgument(args, 'problem');
}

module.exports = workhorse;
