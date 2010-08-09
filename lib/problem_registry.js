var keys = require('keys');


// This is an in-memory list of registry to be solved
function registry (){

  // In-memory key/value data store
  // TODO: maintain state between server starts. will need to wire up a persistent database for that
  var store = new keys.Memory({ reapInterval: 200 });
  
  var unsolved = {};
  var being_solved = {};
  var solved = {};

  // retrieve a problem by its id
  // if the problem has been solve, the solution will also be returned
  function get(problem_id, callback) {

    store.get(problem_id, function(err, problem) {
        
        callback(err, problem);

      });


  }

  // add a problem to be solved
  function register(problem_id, data, callback) {

    if(!problem_id) {

      callback({message: 'You must provide a problem id'});

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
          
            store.set(problem_id, {id: problem_id, data: data}, function(err) {
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
      else if(problem.solution) {
        callback('Problem with id: [' + problem_id + '] has already been solved');
      }
      else {

        store.set(problem_id, {problem: problem, solution: solution}, function(err){
          callback(err);
        });

      }

    });

  }


  return {
    register: register,
    solve: solve,
    get: get
  };

}

// expose a single constructor for a problem registry
exports.create = function() { return new registry()};