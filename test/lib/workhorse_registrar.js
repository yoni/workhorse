var express = require('express');
var assert = require('assert');
workhorse = require('../../lib/workhorse_registrar').create();

// SETUP
// add a problem to solve

// Checked before exit of the PostSolution
var post_solution_result;


// TESTS
module.exports = {
    'POST problem': function(beforeExit) {
        workhorse.postProblem('add_two_numbers', 'adder', {a:1, b:2}, function(err) {
            if (err)
                throw err;
        },
        function(result) {
            post_solution_result = result;
        });
    },
    'GET problem': function(beforeExit) {
        var problem;

        workhorse.getProblem(function(err, prob){
            problem = prob;
        });

        beforeExit( function() {
            // FIXME: solution is already set to 3 by the time we run this, since tests
            // are run in parallel.
            assert.deepEqual(problem,
                {"id":"add_two_numbers","solver":"adder","data":{"a":1,"b":2},"solution":3});
        });

    },
    'POST solution' :  function(beforeExit) {
        var solution = {
            solution: 3,
            problem_id: "add_two_numbers"
        };

        var post_succeeded = false;
        workhorse.postSolution(solution, function(err){
            if(err) {
                throw 'Could not post the solution';
            }
            else {
                post_succeeded = true;
            }
        });

        beforeExit(function() {
            assert.ok(post_succeeded);
            assert.deepEqual(post_solution_result, {problem_id: 'add_two_numbers', solution: 3});
        });

    },
    'GET solution' : function() {

        var solution = 3;
        var problem_id = "add_two_numbers";

        workhorse.getSolution('add_two_numbers', function(error, solution) {
            assert.ok(!error);
            assert.equal(solution, 3);
        });
    }
};



