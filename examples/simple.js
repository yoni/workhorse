var workhorse = require('../workhorse');

workhorse({
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
    callback('Got your solution for problem ' + problem_id + '. thanks for helping out\n');
  }
}).listen(8000);

