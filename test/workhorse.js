var express = require('express'),
    workhorse = require('../workhorse').create();

var solution = null;

var callbackURI = 'http://localhost:9999';

// We check this flag after the solution is POSTed to make sure the workhorse server
// POSTs the solution to the callback URI
var callbackURI_was_called_when_solution_was_posted = false;

// A user's server, which is waiting to receive the solution
var user_server = express.createServer();
user_server.post('/', function(req, res){
  callbackURI_was_called_when_solution_was_posted = true;
  res.send('got the solution!');
  // expecting a single call POSTing the solution, then killing the server
  user_server.close();
});
user_server.listen(9999);

// add a problem to solve
workhorse.register('add_two_numbers', 'adder', callbackURI, {a:1, b:2}, function(sol) {
    solution = sol;
  });
  
// Create a simple server. Expresso will call the 'listen' function and run each test
var server = workhorse.createServer();

// expresso will run all tests in 'exports'
module.exports = {
  'GET homepage': function(assert) {
    assert.response(server, {
      url: '/',
      timeout: 500
    },
    {
      status: 200
    },
    function(res) {
      assert.ok(res.body.search('<title>Workhorse</title>') != - 1);
    });
  },
  'GET problem': function(assert) {

    assert.response(server, {
      url: '/problem',
      timeout: 500
    },
    {
      status: 200,
      body: '{"id":"add_two_numbers","solver":"adder","callbackURI":"http://localhost:9999","data":{"a":1,"b":2},"solution":null}'
    });
  },
  'POST solution': function(assert, beforeExit) {
    var solution = {
      solution: 3,
      problem_id: "add_two_numbers"
    };
    var body = JSON.stringify(solution);
    assert.response(server,
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
      function(res){
        assert.equal(3, solution.solution);
        assert.equal("add_two_numbers",  solution.problem_id);
      });

    beforeExit(function(){
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
          'Content-Type': 'application/json',
        },
        timeout: 500
      },
      {
        status: 200,
        body: solution
      });

  }
};

