var problem_registry = require('../../lib/problem_registry'),
        keys = require('keys');

var callbackURI = 'http://localhost:8000/404';

function newRegistry() {
    return problem_registry.create(new keys.Memory({ reapInterval: 200 }));
}


module.exports = {
    'Constructor': function(assert) {

        var pr = newRegistry();
        assert.ok(pr);

    },
    'Register a problem': function(assert, beforeExit) {

        var add_worked;
        var error;

        var pr = newRegistry();

        pr.register('add two numbers', 'adder', {a:1, b:2}, function(err, problem) {
            if (!err) {
                if (!problem) {
                    throw new Error('Did not get back the problem after registration, but the registration'
                            + ' completed and returned no error');
                }

                add_worked = true;
            }
            else {
                error = err;
            }
        });

        beforeExit(function() {
            assert.ok(!error, error);
            assert.ok(add_worked, 'Could not add a problem');
        });

    },
    "Can not register same problem twice": function(assert, beforeExit) {

        var can_not_add_same_problem_twice = false;
        var pr = newRegistry();

        pr.register('add two numbers', 'adder', {a:1, b:2}, function(err) {
            pr.register("add two numbers", 'adder', {a:1, b:3}, function(err) {

                if (err) {
                    can_not_add_same_problem_twice = true;
                }

            });
        });

        beforeExit(function() {
            assert.ok(can_not_add_same_problem_twice, 'Registering the same problem twice worked. Expected an error.');
        });

    },
    'Get a problem which has been registered': function(assert, beforeExit) {

        var get_worked;
        var error;
        var pr = newRegistry();

        pr.register('1', 'adder', {greeting:'hi'}, function(err1) {

            if (err1) {
                error = err1;
            }
            else {

                pr.get('1', function(err2, problem) {

                    if (err2) {
                        error = err2;
                    }
                    else if (problem
                            && problem.id === '1'
                            && problem.data.greeting === 'hi') {
                        get_worked = true;
                    }
                });

            }

        });

        beforeExit(function() {
            assert.ok(!error, error);
            assert.ok(get_worked, 'Could not retrieve the problem');
        });

    },
    'Solve a problem': function(assert, beforeExit) {

        var solve_worked;
        var error;
        var pr = newRegistry();

        pr.register('1', 'adder', {greeting:'hi'}, function(err) {

            if (err) {
                error = err;
            }
            else {

                pr.solve('1', {answer: 42}, function(err) {

                    if (err) {
                        error = err;
                    }
                    else {
                        solve_worked = true;
                    }

                });

            }

        });

        beforeExit(function() {
            assert.ok(!error, error);
            assert.ok(solve_worked, 'Could not solve the problem');
        });
    },
    'Can not solve a problem twice': function(assert, beforeExit) {

        var can_not_solve_twice;
        var error;
        var pr = newRegistry();

        pr.register('1', 'greeter', callbackURI, {greeting:'hi'}, function(err1) {

            if (err1) {
                error = err1;
            }
            else {

                pr.solve('1', {answer: 42}, function(err2) {

                    if (err2) {
                        error = err2;
                    }
                    else {
                        pr.solve('1', {answer: 42}, function(err3) {

                            // Expecting an error on the second call to 'solve'
                            if (err3) {
                                can_not_solve_twice = true;
                            }

                        });

                    }

                });

            }

        });

        beforeExit(function() {
            assert.ok(!error, error);
            assert.ok(can_not_solve_twice, 'Should not be able to solve the same problem twice');
        });
    },
    'Get the next problem from the queue': function(assert, beforeExit) {

        var got_problem_to_solve;
        var error;
        var pr = newRegistry();

        pr.register('1', 'adder', callbackURI, {a:1, b:2}, function(err1) {

            if (err1) {
                error = err1;
            }
            else {
                pr.getNextProblemToSolve(function(err2, problem) {
                    if (err2) {
                        error = err2;
                    }
                    else {
                        got_problem_to_solve = true;
                    }
                });

            }

        });

        beforeExit(function() {
            assert.ok(!error, error);
            assert.ok(got_problem_to_solve, 'Could not get problem to solve');
        });
    }

};
