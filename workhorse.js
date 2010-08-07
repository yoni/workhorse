var connect = require('connect'),
    express = require('express');

var problems = {};

function createServer(args) {
  
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

// register a problem to be solved
function solve(solver, args, callback, problem_id) {
  problem_id = validateOrGet(problem_id);
  problems.push({solver: solver, args: args, callback: callback, id: problem_id});
}

function validateOrGet(problem_id) {
  if(problem_id) {
    if(problems[problem_id])
      throw 'The problem id must be unique, yet a problem exists with id ' + problem_id;
  }
  else {
    while(!problem_id && !problems[problem_id]) {
      problem_id = Math.random();
    }
  }
  return problem_id;
}

function validateArgs(args) {
  function validateFunctionArgument(args, name) {
    if(!args[name] || (typeof args[name] != 'function'))
      throw "Initialization error. Was expecting an argument '" + name + "' of type 'function'";
  }
  validateFunctionArgument(args, 'solution');
  validateFunctionArgument(args, 'problem');
}

exports.createServer = createServer;
