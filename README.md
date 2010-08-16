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
