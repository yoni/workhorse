var keys = require('keys');


// This is an in-memory list of registry to be solved
function registry (){

  // In-memory key/value data store
  // TODO: maintain state between server starts. will need to wire up a persistent database for that
  var store = new keys.Memory({ reapInterval: 200 });

  // TODO: persist these and keep track of the timestamp problems were queued and distributed
  var queue = [];
  var distributed = [];

  // Retrieve a problem by its id
  // If the problem has been solved, the solution will also be returned
  function get(problem_id, callback) {

    store.get(problem_id, function(err, problem) {
        callback(err, problem);
      });

  }

  // Register a problem to be solved
  function register(problem_id, solver, callbackURI, data, callback) {

    if(!problem_id) {
      callback('You must provide a problem id');
    }
    else {

      store.has(problem_id, function(err, exists){

          if(err) {
            callback(err);
          }
          else if(exists) {
            callback('The problem id must be unique, yet a problem exists with id [' + problem_id + ']');
          }
          else {
          
            store.set(
              problem_id,
              {
                id: problem_id,
                solver: solver,
                callbackURI: callbackURI,
                data: data,
                solution: null 
              },
              function(err) {
                if(!err) {
                  queue.push(problem_id);
                }
                callback(err);
              });

          }
          
        });
        
    }

  }


  function solve(problem_id, solution, callback) {

    store.get(problem_id, function(err, problem) {
  
        if(err) {
          callback(err);
        }
        else if(!problem) {
          callback('No problem with id [' + problem_id + ']');
        }
        else if(problem.solution) {
          callback('Problem with id: [' + problem_id + '] has already been solved');
        }
        else {

          store.set(problem_id, {problem: problem, solution: solution}, function(err){
          
            if(!err) {
              var index = distributed.indexOf(problem_id);
              distributed.splice(index,1);
            }

            callback(err, problem);
            
          });

       }

      });

  }

  function getNextProblemToSolve(callback) {

    if(queue.length) {

      var problem_id = queue.shift();

      store.get(problem_id, function(err, problem) {

          if(err) {
            // getting the problem failed. put the problem back in the queue
            queue.unshift(problem_id);
            callback(err);
          }
          else {
            distributed.push(problem_id);
            callback(null, problem);
          }

        });
    }
    else {
      callback();
    }

  }

  return {
    register: register,
    solve: solve,
    get: get,
    getNextProblemToSolve: getNextProblemToSolve
  };

}

// expose a single constructor for a problem registry
exports.create = function() { return new registry()};