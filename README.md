Workhorse
=========

Workhorse is a distributed computing server. It serves up problems and solvers and accepts solutions.
It is currently intended for running bandwidth or processor intensive operations on the client side of a web application, but can also be useful for serving up jobs to server clusters.

Keep in mind this stuff is in early development. Please let me know if you have issues or patches. Happy solving :)

Usage
-----
For Usage, see examples. For more detailed use cases, see tests.

Dependencies
------------
For dependencies, see package.json

Run All Tests
---------
    expresso

Run Individual Tests
---------
    expresso test/workhorse.js
    expresso test/problem_registry.js

Design
------
Workhorse holds a registry of problems and their solutions in the form of key/value pairs. This registry
uses a key/value data store, which is the main argument to the workhorse create function. All tests use the
in-memory key/value store provided with the [keys](http://github.com/visionmedia/keys) library.

Workhorse provides an HTTP server for GETting problems to solve, GETting solvers, and POSTing solutions
in a RESTful way. POSTing problems will be supported in the near future, as well.

Once a problem has been solved, GETting the problem will incluse the solution. The solution will also be POSTed
to the URI with which it was registered. For details on how this works, see `examples/simple.js` or `test/problem_registry.js`.
