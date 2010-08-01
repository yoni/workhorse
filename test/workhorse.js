var workhorse = require('../workhorse');

// Create a simple server. Expresso will call the 'listen' function and run each test for us
var server = workhorse({
  // use a static problem server, which always returns the same problem
  problem: function(callback) {
    callback({
      id: '1',
      description: 'Add two numbers and send back the result',
      solver: 'adder',
      args: {
        a: 2,
        b: 3
      }
    })
  },
  // use a static solution taker, which simply returns a message that the solution has been received
  solution: function(solution, problem_id, callback) {
    callback('got your solution for problem ' + problem_id + '. thanks for helping out\n');
  }
});

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
      body: '{"id":"1","description":"Add two numbers and send back the result","solver":"adder","args":{"a":2,"b":3}}'
    });
  },
  'POST solution': function(assert) {
    var solution = {
      solution: 5,
      problem_id: 1
    };
    var body = JSON.stringify(solution);
    assert.response(server, {
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
      body: 'got your solution for problem 1. thanks for helping out\n'
    });
  }
};

