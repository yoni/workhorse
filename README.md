Workhorse
=========

Workhorse is a distributed computing server. It serves up problems and solvers and accepts solutions. It is currently intended for running bandwidth or processor intensive operations on the client side of a web application, but can also be useful for serving up jobs to server clusters.

Keep in mind this stuff is in early development. Please let me know if you have issues or patches. Happy solving :)

Usage
-----
    var server = workhorse({
      problem: function(callback) {
        callback({
          id: '1',
          description: 'Add two numbers',
          solver: 'adder',
          args: {
            a: 2,
            b: 3
          }
        })
      },
      solution: function(solution, problem_id, callback) {
        callback('Received your solution for problem ' + problem_id + '. thanks for helping out!');
      }
    });

    server.listen(8080);

Run dependencies
----------------
* node.js -- http://nodejs.org/  -- 0.1.100
* connect -- http://github.com/senchalabs/connect
* express -- http://expressjs.com/

Test dependencies
-----------------
* expresso -- http://github.com/visionmedia/expresso

