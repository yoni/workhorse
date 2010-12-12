Workhorse
=========

Workhorse is a distributed computing server. It serves up problems and solvers and accepts solutions.
It is currently intended for running bandwidth or processor intensive operations on the client side of a web application, but can also be useful for serving up jobs to server clusters.

Keep in mind this stuff is in early development. Please let me know if you have issues or patches. Happy solving :)

Usage
-----
For usage, see examples. For more detailed use cases, see tests.

Dependencies
------------
For runtime dependencies, see package.json

Run All Tests
---------
    bin/test

Run Individual Tests
---------
    expresso <test path>

e.g.
    expresso test/workhorse.js


Examples
--------
See the examples directory.

Data Stores
----------
Workhorse holds a registry of problems and their solutions in the form of key/value pairs. This registry
uses a key/value data store, which is the main argument to the workhorse create function.

If you do not pass in a datastore, an in-memory data store will be used. All tests use the
in-memory key/value store provided with the [keys](http://github.com/visionmedia/keys) library.

You may use any of the `keys` supported database management systems or roll your own data store,
implementing the `set`, `has`, and `get` actions.

A CouchDB data store is also being developed as part of the workhorse library and supports the
aforementioned actions.

Server
------
Workhorse provides a server for retrieving problems to solve and solvers, and posting solutions. The server
is based on the WebSocket protocol, using the socket.io library. For browsers which to not support WebSockets,
socket.io with automatically fall back on HTTP polling.

Once a problem has been solved, the problem will include the posted solution.

Client
------
The workhorse client loads a problem from the server and spawns a WebWorker to solve it. The solution
is then posted back to the server and another problem is retrieved. This is repeated indefinitely.

Source Repository
-----------------
https://github.com/yoni/workhorse