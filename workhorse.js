var connect = require('connect'),
    express = require('express'),
    request = require('request'),
    problem_registry = require('./lib/problem_registry');

/**
 * Create a new workhorse.
 */
function workhorse() {

  var registry = problem_registry.create();

  var callbacks = {};

  /**
   * Registers a problem to be solved
   *
   * @param solver -- the type of solver that is used to solve this problem
   * @param data -- the data to pass to the solver
   * @param callback -- a function to call with the solution results
   * @param problem_id -- a unique id
   * @return problem_id -- the unique key for the problem added
   */
  function register(problem_id, solver, data, callback) {

    registry.register(problem_id, solver, data, function(err){
    
      if(err) {
        callback(err);       
      }
      else {
        callbacks[problem_id] = callback;
      }

    });

  }

  /**
   * Create an Express.js HTTP server.
   * @return a workhorse server, which is an extension of an express server
   */
  function createServer() {

    var app = express.createServer(
        connect.logger(),       // log all requests
        connect.bodyDecoder()); // make the POST body available using req.body

    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.use('/static', connect.staticProvider(__dirname + '/static'));
        app.use('/solvers', connect.staticProvider(__dirname + '/solvers'));
      });

    // request handlers
    app.get('/', function(req, res){

        res.render('index.html.ejs');

      });
    app.get('/problem', function(req,res){

        registry.getNextProblemToSolve(function(err, problem){
        
          if(err) {
            throw err;
          }
          else {
            if(!problem) {
              res.send({ error: 'No problems found.' });
            }
            res.send(problem);
          }

        });

      });
    app.post('/solution', function(req,res){

        var solution = req.body.solution;
        var problem_id = req.body.problem_id;

        registry.solve(problem_id, solution, function(err, problem) {

            if(err) {
              throw err;
            }
            else {

              // post the solution to the configured uri
              if(problem.callbackURI) {

                request(
                  {
                    uri : problem.callbackURI,
                    method : 'POST',
                    body : JSON.stringify(solution)
                  },
                  function (error, response) {
                    if (!error && response.statusCode == 200) {
                      sys.puts(response);
                    }
                  });

              }
              
              res.send({problem_id: problem_id, wrote_solution: "OK"})
              callbacks[problem_id](solution);
            }

          });
          

      });
    app.get('/solution/:problem_id', function(req,res){

        var problem_id = req.params.problem_id;

        registry.get(problem_id, function(err, problem) {

            if(err) {
              throw err;
            }
            else if(!problem) {
              res.send({ error: 'No problem with id [' + problem_id + ']'}, 404);
            }
            else if(!problem.solution) {
              res.send({ error: 'No solution for problem with id [' + problem_id + ']' }, 404);
            }
            else if(problem.solution) {
            
              var solution = problem.solution;
              
              // respond with the solution
              res.send(JSON.stringify(solution));


            }

          });

      });


    return app;

  }

  return {
    createServer: createServer,
    register: register
  };

}

exports.create = function(){
  return new workhorse();
};
