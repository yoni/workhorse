var workhorse = require('../workhorse').create();

var solution = null;

// add a problem to solve
workhorse.register('add_two_numbers', 'adder', {a:1, b:2}, function(sol) {
    solution = sol;
  });
  
// Create a simple server. Expresso will call the 'listen' function and run each test for us
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
      body: '{"id":"add_two_numbers","solver":"adder","data":{"a":1,"b":2}}'
    });
  },
  'POST solution': function(assert) {
    var solution = {
      solution: 3,
      problem_id: "add_two_numbers"
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
      body: '{"problem_id":"add_two_numbers","wrote_solution":"OK"}'
    },
    function(res){
      assert.equal(3, solution.solution);
      assert.equal("add_two_numbers",  solution.problem_id);
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

