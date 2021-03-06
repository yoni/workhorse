(function() {

    $(document).ready(start_workhorse_client);

    // Logging if there is a console
    function log(message) {
        if(console) {
            console.log(message);
        }
    }

    /**
     * Connects to the workhorse server, retrieves problems, and spawns WebWorkers to work on those problems.
     */
    function start_workhorse_client() {

        var socket = new io.Socket("localhost");
        log('Loading workhorse client.');

        var problems_solved = 0;

        socket.on('connect', function() {
            log('Connect yo.');
            ready();
        });

        socket.on('message', function(msg) {
            log(['WebSocket message: ', msg]);
            // TODO: have message contain a problem, as opposed to being a problem
            work(msg);
        });

        socket.connect();

        /**
         * Indicate to the workhorse server that the client is ready to receive the next problem.
         */
        function ready() {
            socket.send({ ready: true });
        }

        /**
         * Solve the given problem. Problems look like: {solver:solver, data:data}
         * @param problem
         */
        function work(problem) {
            log(['Got a problem from the server: ', problem]);

            var solved = false;
            var start_time = new Date();

            if (window.Worker) {
                function delegateToWorker() {
                    var worker = new Worker('/solvers/' + problem.solver + '.js');

                    worker.onmessage = function(msg) {

                        if (msg.data.solution) {
                            // another worker might have already solved it
                             log([
                                'Sending solution to server',
                                {
                                    problem: problem,
                                    solution: msg.data.solution
                                }
                            ]);

                            if(!solved) {
                                socket.send({problem: problem, solution: msg.data.solution});

                                solved = true;
                                problems_solved++;

                                var seconds_to_solve = (new Date() - start_time)/1000;
                                log_performance(seconds_to_solve);
                                update_num_problems_solved();
                            }

                            ready();
                        }
                        else if(msg.data.status) {
                            log(['WebWorker status: ', msg.data.status]);
                        }
                        else {
                            log(['Sending error to server: ',{problem: problem, error: msg}]);
                            //socket.send({problem: problem, error: 'error solving problem'});
                        }

                    };
                    worker.postMessage(problem.data);
                }
                // First worker
                delegateToWorker();

            } else {
                log('This browser does not support web workers.');
            }
        }


        // Some performance and debugging info
        var session_start_date = new Date();

        function log_total_time() {
            log('Start time  : ' + session_start_date.toUTCString());
            log('Current time: ' + (new Date).toUTCString());
        }

        function log_average_time() {
           log('Average time per problem in milliseconds: ' +
                   (new Date() - session_start_date) / problems_solved) ;
        }

        function log_performance(seconds_to_solve) {
           log('Seconds to solve: ' + seconds_to_solve);
           log('Problems solved: ' + problems_solved);
           log_total_time();
           log_average_time();
        }

        function update_num_problems_solved() {
            $('.problems_solved').html(problems_solved);
        }

        window.workhorse = {
            ready: ready,
            socket: socket
        };
   }
})();