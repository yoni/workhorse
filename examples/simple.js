var express = require('express'),
    connect = require('connect'),
    workhorse = require('../workhorse');

var wh = workhorse.create();

wh.addProblemListener(function(message) {
    console.log(message);
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
                console.log('Posted a problem');
            }
        },
        function(solution) {
            console.log('Got a solution in the callback:', solution);
        });

wh.getProblem(function(error, problem){
    if(error) {
        throw error;
    }
    else {
        console.log('Got a problem.');
        wh.postSolution({solution:problem.data.a + problem.data.b, problem_id: 'add_two_numbers'}, function(err) {
            if(err) {
                throw err;
            }
            else{
                console.log('Posted the solution.');
                wh.getSolution('add_two_numbers', function(err, solution) {
                    if(err) {
                        throw err;
                    }
                    else {
                        console.log('Got the solution.');
                    }
                });
            }
        });
    }
});

