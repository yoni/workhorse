var express = require('express');
workhorse = require('../workhorse').create();

// SETUP
// add a problem to solve


workhorse.listen(
    {
        socket:{
            addListener:function() {}
        }
    });

// TESTS
module.exports = {
    'POST problem': function(assert, beforeExit) {
        workhorse.postProblem('add_two_numbers', 'adder', {a:1, b:2}, function(err) {
            if (err)
                throw err;
        });
    },
    'GET problem': function(assert, beforeExit) {
        var problem;

        workhorse.getProblem(function(err, prob){
            problem = prob;
        });
        
        beforeExit(function(){
            assert.deepEqual(problem,
            {"id":"add_two_numbers","solver":"adder","data":{"a":1,"b":2},"solution":null});
            exportPostSolutionTest();
        });

    }
};

function exportPostSolutionTest() {

    exports['POST solution'] =  function(assert, beforeExit) {
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
            exportGetSolutionTest();
        });

    };
}

function exportGetSolutionTest() {
    exports['GET solution'] = function(assert) {

        var solution = 3;
        var problem_id = "add_two_numbers";

        workhorse.getSolution('add_two_numbers', function(error, solution) {
            assert.ok(!error);
            assert.equal(solution, 3);
        });
    }
}

