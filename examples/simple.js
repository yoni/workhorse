var express = require('express'),
    connect = require('connect'),
    log = require('util').log,
    workhorse = require('../workhorse');

var wh = workhorse.create();

wh.addProblemListener(function(message) {
    log(message);
});

// Register two problems to be solved
wh.postProblem(
        'add_two_numbers',
        'adder',
        {a:1, b:3},
        function(err) {
            if(err) {
                throw err;
            }
            else {
                log('Posted a problem');
            }
        },
        function(solution) {
            log('Got a solution in the callback:', solution);
        });

// Retrieve a problem and post a solution
wh.getProblem(function(error, problem){
    if(error) {
        throw error;
    }
    else {
        log('Got a problem.');
        wh.postSolution({solution:problem.data.a + problem.data.b, problem_id: 'add_two_numbers'}, function(err) {
            if(err) {
                throw err;
            }
            else{
                log('Posted the solution.');
                wh.getSolution('add_two_numbers', function(err, solution) {
                    if(err) {
                        throw err;
                    }
                    else {
                        log('Got the solution.');
                    }
                });
            }
        });
    }
});

