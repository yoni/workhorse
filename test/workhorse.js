var express = require('express');
workhorse = require('../workhorse').create();

// SETUP
// add a problem to solve
workhorse.registerProblem('add_two_numbers', 'adder', {a:1, b:2}, function(err) {
    if (err)
        throw err;
});


workhorse.listen(
    {
        socket:{
            addListener:function() {}
        }
    });

// TESTS
module.exports = {

    'GET problem': function(assert, beforeExit) {
        var problem;

        workhorse.getProblem(function(err, prob){
            problem = prob;
        });
        
        beforeExit(function(){
            assert.deepEqual(problem,
            {"id":"add_two_numbers","solver":"adder","data":{"a":1,"b":2},"solution":null});
        });

    },
    'POST solution': function(assert, beforeExit) {
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
        });
        
    },
    'GET solution': function(assert) {

        var solution = 3;
        var problem_id = "add_two_numbers";

        workhorse.getSolution('add_two_numbers', function(error, solution) {
            assert.ok(!error);
            assert.equal(solution, 3);
        });
    }
};

var oldTests = {
    'Workhorse browser client': function(assert) {

        assert.response(server, {
            url: '/browser_client.js',
            method: 'GET',
            headers: {
                'Host': 'localhost',
                'Content-Type': 'application/json'
            },
            timeout: 500
        },
        {
            status: 200
            // TODO: Test that the browser_client.js script has the correct URIs in it
        });

    }
};

