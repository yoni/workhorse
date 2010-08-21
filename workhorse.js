var connect = require('connect'),
    express = require('express'),
    request = require('request'),
    assert = require('assert'),
    keys = require('keys'),
    problem_registry = require('./lib/problem_registry');

/**
 * Creates a workhorse, along with it's data store and servers (see createServers() and register())
 */
exports.create = function(datastore){
  return new workhorse(datastore);
};

/**
 * Create a new workhorse.
 */
function workhorse(datastore) {

  if(!datastore) {
    datastore = new keys.Memory({ reapInterval: 200 });
    console.log('Warning: Using an in-memory data store. The problems and solutions will not be persisted'
        + ' between application restarts');
  }

  var registry = problem_registry.create(datastore);
  var browser_client_uri = 'browser_client.js';

  function validate(argtypes, message) {
    
    for(i in argtypes) {
      var arg = argtypes[i][0];
      var type = argtypes[i][1];
      assert.ok(arg, message);
      assert.equal(typeof arg, type);
    }

  }

  /**
   * Registers a problem to be solved
   * TODO: Change the order of the arguments so that callback args are at the end
   * @param problem_id -- a unique id
   * @param solver -- the type of solver that is used to solve this problem
   * @param data -- the data to pass to the solver
   * @param callbackURI -- a URI to POST the solution to
   * @param callback -- called after the problem is registered
   * @return problem_id -- the unique key for the problem added
   */
  function register(problem_id, solver, callbackURI, data, callback) {
    validate(
      [
        [problem_id, 'string'],
        [solver, 'string'],
        [callbackURI, 'string'],
        [data, 'object'],
        [callback, 'function']
      ],
      'Could not register a problem due to invalid arguments. Expecting:' + 
      '{ problem_id : "..."}, solver: "...", callbackURI: "...", ' + 
      'data: {...}, callback: function(err){...} }'
      );

    registry.register(
      problem_id,
      solver,
      callbackURI,
      data,
      function(err){
        callback(err);       
      });

  }

  /**
   * Create a workhorse HTTP server, which extends the express.js server.
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

        // TODO: Show a help page, server setup, examples, etc on the home page
        // TODO: Add a separate page for the client-side example
        res.render('index.html.ejs',
          {
            locals: {
              browser_client_uri: browser_client_uri
            }
          });
          
      });
    app.get('/problem', function(req,res){

        registry.getNextProblemToSolve(function(err, problem){
        
          if(err) {
            throw err;
          }
          else {
            if(!problem) {
              res.send({ error: 'No problems found.' }, 404);
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
                    if(error)
                      // TODO: 1. Record that the POST was not successful
                      // TODO: 2. Set some timeout to retry the POST until it's successful,
                      //       or better yet, store the problem as completed but not POSTed,
                      //       and have some cron job for rePOSTing all not-POSTed solutions
                    if (!error && response.statusCode == 200) {
                      // TODO: record that the POST was successful
                    }
                  });

              }
              
              res.send({problem_id: problem_id, wrote_solution: "OK"})
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
    app.get('/' + browser_client_uri, function(req,res) {
      // FIXME: CONTENT-TYPE is text/html instead of text/javascript
      res.render(browser_client_uri + '.ejs',
        {
          locals: {
            problem_uri: '/problem',
            solution_uri: '/solution',
            solvers_uri: '/solvers'
          },
          layout: false,
        });
      });

    return app;

  }

  return {
    createServer: createServer,
    register: register
  };

}
