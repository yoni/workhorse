var connect = require('connect'),
    express = require('express'),
    request = require('request'),
    assert = require('assert'),
    keys = require('keys'),
    problem_registry = require('./lib/problem_registry');

/**
 * Creates a workhorse, along with it's data store and servers (see createServers() and register())
 */
exports.create = function(datastore) {
    return new workhorse(datastore);
};

/**
 * Create a new workhorse.
 */
function workhorse(datastore) {

    if (!datastore) {
        datastore = new keys.Memory({ reapInterval: 200 });
        console.log('Warning: Using an in-memory data store. The problems and solutions will not be persisted'
                + ' between application restarts');
    }

    var registry = problem_registry.create(datastore);
    var browser_client_uri = 'browser_client.js';

    function validate(argtypes, message) {

        for (i in argtypes) {
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
     * @param callback -- called after the problem is registered
     * @return problem_id -- the unique key for the problem added
     */
    function register(problem_id, solver, data, callback) {
        validate(
                [
                    [problem_id, 'string'],
                    [solver, 'string'],
                    [data, 'object'],
                    [callback, 'function']
                ],
                'Could not register a problem due to invalid arguments. Expecting:' +
                        '{ problem_id : "..."}, solver: "...", data: {...}, callback: function(err){...} }'
                );

        registry.register(
                problem_id,
                solver,
                data,
                function(err) {
                    callback(err);
                });

    }

    /**
     * Create a workhorse HTTP server, which extends the express.js server.
     * @return a workhorse server, which is an extension of an express server
     */
    function listen(options) {

        options.socket.addListener('message', function(message) {
            console.log(message);
        });

    }

    // TODO: This should be the socket "ready:true" handler
    function getProblem() {

        registry.getNextProblemToSolve(function(err, problem) {

            if (err) {
                throw err;
            }
            else {
                if (!problem) {
                    res.send({ error: 'No problems found.' }, 404);
                }
                res.send(problem);
            }

        });

    }

    // TODO: this should be the socket "postSolution" handler
    // TODO: take the socket client and reply with 'ok' or 'err'
    function postSolution(client, body) {

        var solution = body.solution;
        var problem_id = body.problem_id;

        registry.solve(problem_id, solution, function(err, problem) {

            if (err) {
                throw err;
            }
            else {
                client.send({problem_id: problem_id, wrote_solution: "OK"})
            }

        });

    }

    // TODO: This should be an asynchronous function call to get a solution
    // TODO: Need a similar notion for a batch
    function getSolution(problem_id) {

        registry.get(problem_id, function(err, problem) {

            if (err) {
                throw err;
            }
            else if (!problem) {
                res.send({ error: 'No problem with id [' + problem_id + ']'}, 404);
            }
            else if (!problem.solution) {
                res.send({ error: 'No solution for problem with id [' + problem_id + ']' }, 404);
            }
            else if (problem.solution) {

                var solution = problem.solution;

                // respond with the solution
                res.send(JSON.stringify(solution));

            }

        });

    }

    // TODO: need to figure out where/how the client script gets loaded/passed/etc.
    return {
        listen: listen,
        register: register
    };

}
