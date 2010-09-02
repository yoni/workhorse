var keys = require('keys');

/**
 * A registry wraps s few simple problem registration actions and supports any asynchronous
 * data store. A data store might use an in-memory client like 'keys' or a 'couchdb' client.
 *
 * Data store operations are modeled after a subset of the 'keys' API: has, get, and set
 * For more info, see http://github.com/visionmedia/keys
 */
exports.create = function(store) {
    return new registry(store)
};

function registry(store) {

    if (!store) {
        throw new Error('Could not initialize problem registry. You must provide a datastore to the registry.');
    }

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
    function register(problem_id, solver, data, callback) {

        if (!problem_id) {
            callback('You must provide a problem id');
        }
        else {

            store.has(problem_id, function(err, exists) {

                if (err) {
                    callback(err);
                }
                else if (exists) {
                    callback('The problem id must be unique, yet a problem exists with id [' + problem_id + ']');
                }
                else {
                    var problem =
                    {
                        id: problem_id,
                        solver: solver,
                        data: data,
                        solution: null
                    };

                    store.set(
                            problem_id,
                            problem,
                            function(err) {
                                if (!err) {
                                    queue.push(problem_id);
                                }
                                callback(err, problem);
                            });

                }

            });

        }

    }


    function solve(problem_id, solution, callback) {

        store.get(problem_id, function(err, problem) {

            if (err) {
                callback(err);
            }
            else if (!problem) {
                callback('No problem with id [' + problem_id + ']');
            }
            else if (problem.solution) {
                // Not an error anymore, just return the first solution
                // callback('Problem with id: [' + problem_id + '] has already been solved');
                callback(null, problem);
            }
            else {
                problem.solution = solution;
                store.set(problem_id, problem, function(err) {

                    if (!err) {
                        var index = distributed.indexOf(problem_id);
                        distributed.splice(index, 1);
                    }

                    callback(err, problem);

                });

            }

        });

    }

    function getNextProblemToSolve(callback) {

        if (queue.length) {

            var problem_id = queue.shift();

            store.get(problem_id, function(err, problem) {

                if (err) {
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
