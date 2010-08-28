var express = require('express');
workhorse = require('../workhorse').create();

// SETUP
// add a problem to solve
workhorse.register('add_two_numbers', 'adder', {a:1, b:2}, function(err) {
    if (err)
        throw err;
});


workhorse.listen({socket:{addListener:function() {
}}});

// TESTS

var oldTests = {
    'GET problem': function(assert, beforeExit) {

        assert.response(server, {
            url: '/problem',
            timeout: 500
        },
        {
            status: 200,
            body: '{"id":"add_two_numbers","solver":"adder","data":{"a":1,"b":2},"solution":null}'
        });
    },
    'POST solution; solution is POSTed to the callbackURI': function(assert, beforeExit) {
        var solution = {
            solution: 3,
            problem_id: "add_two_numbers"
        };
        var body = JSON.stringify(solution);
        assert.response(
                server,
        {
            url: '/solution',
            method: 'POST',
            body: body,
            headers: {
                'Host': 'localhost',
                'Content-Type': 'application/json',
                'Content-Length': body.length
            },
            timeout: 500
        },
        {
            status: 200,
            body: '{"problem_id":"add_two_numbers","wrote_solution":"OK"}'
        },
                function(res) {
                    assert.equal(3, solution.solution);
                    assert.equal("add_two_numbers", solution.problem_id);
                });

        beforeExit(function() {
            assert.ok(callbackURI_was_called_when_solution_was_posted);
        });
    },
    'GET solution': function(assert) {

        var solution = 3;
        var problem_id = "add_two_numbers";

        var body = JSON.stringify(solution);

        assert.response(server, {
            url: '/solution/' + problem_id,
            method: 'GET',
            headers: {
                'Host': 'localhost',
                'Content-Type': 'application/json'
            },
            timeout: 500
        },
        {
            status: 200,
            body: solution
        });

    },
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

