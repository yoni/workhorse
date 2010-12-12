/*
    Workhorse logic

    This is mostly a custom wrapper around the node 'workhorse' module
    optimized for the word search needs of Fragnut.

    Mostly, we added WebSocket support, with our home-grown 'socket' client.

    We're using the in-memory datastore for workhorse, since it's a real-time game
    with (close to) a 1-1 ratio between clients and problems.

 */
var workhorse = require('workhorse');
var available_clients = require('./available_clients');
var log = console.log;

/**
 * Creates a new workhorse with access to this closure's
 */
function create() {

    var wh = workhorse.create();

    var socket;

    // A hash map of {client -> problem}
    var distributed_problems = {};

    var failed_problem_queue = [];

    /**
     * Listens on the given server for WebSocket events. Sock will only pass
     * messages which have the configured given namespace (usually 'workhorse').
     *
     * @param options
     */
    function listen(options) {
        socket = options.socket;

        socket.addListener('connection', function(client) {

            client.addListener('message', function(msg) {
                msg = socket.clean(msg);

                if (msg.ready && msg.ready === true) {
                    log('Client: ' + client.sessionId + ' is ready.');
                    available_clients.add(client);
                    distribute_problems();

                    client.addListener('disconnect', function() {
                        available_clients.remove(client);
                        var problem = distributed_problems[client.sessionId];
                        failed_problem_queue.push(problem);// re-post the problem
                        delete distributed_problems[client.sessionId];
                    });

                }
                else if (msg.solution) {
                    log(msg);
                    delete distributed_problems[client.sessionId];
                    postSolution(msg);
                }
                else {
                    log('Unhandled message: ');
                    log(msg);
                }

            });

            log('Client ' + client.sessionId + ' connected');
        });

        distribute_problems();

        log('Workhorse listening to socket.');
    }

    /**
     * Post the solution to a given problem.
     */
    function postSolution(msg) {
        var problem_id = msg.problem.id;
        var solution = msg.solution;

        wh.postSolution(
           {
               problem_id: problem_id,
               solution: solution
           },
           function(err, result) {
               if(err) {
                   log('Error posting the solution to problem ' + problem_id);
                   log(err);
               }
               else {
                   log('Successfully posted the solution to problem ' + problem_id);
                   log(result);
               }
           });

    }


    /**
     * Send problems to available clients to be solved.
     */
    function distribute_problems () {
        var empty_problem_queue = false;

        log('Distributing problems. Available clients: ' + available_clients.num());

        while(failed_problem_queue.length && available_clients.num()) {
            var client = available_clients.get();
            if(client) {
                var problem = failed_problem_queue.pop();
                socket.send(client, problem);
                distributed_problems[client.sessionId] = problem;
            }
            distributed_problems[client.sessionId] = problem;
        }

        while(available_clients.num() > 0 && !empty_problem_queue) {

            wh.getProblem(function(err, problem){
                if(err) {
                    log('Error getting a problem'); log(err);
                }
                else if(!problem) {
                    //log('No problems to solve');
                    empty_problem_queue = true;
                }
                else {
                    var client = available_clients.get();
                    if(client) {
                        //log('Distributing problem: ', problem.id);
                        socket.send(client, problem);
                        distributed_problems[client.sessionId] = problem;
                    }
                }
            });

        }

    }

    /**
     * Any time a problem is added to Workhorse, we try to distribute problems to available clients
     */
    wh.addProblemListener(function(message) {
        //log('Problem added. Calling distribute problems.');
        distribute_problems();
    });


    wh.numAvailableClients = available_clients.num;
    wh.listen = listen;

    return wh;

}

module.exports.create = create;
