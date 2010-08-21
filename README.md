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
For dependencies, see package.json

Run All Tests
---------
    expresso

Run Individual Tests
---------
    expresso <test path>

e.g.
    expresso test/workhorse.js


Data Store
----------
Workhorse holds a registry of problems and their solutions in the form of key/value pairs. This registry
uses a key/value data store, which is the main argument to the workhorse create function.

If you do not pass in a datastore, an in-memory data store will be used. All tests use the
in-memory key/value store provided with the [keys](http://github.com/visionmedia/keys) library.

You may use any of the `keys` supported database management systems or roll your own data store,
implementing the `set`, `has`, and `get` actions.

A CouchDB data store is also being developed as part of the workhorse library and supports the
aforementioned actions. To use the couchdb datastore, create a couch datastore and initialize the workhorse with it:

    var workhorse = require('workhorse'),
        couch_store = require('workhorse/lib/datastores/couchdb');

    var datastore = couch_store.create('localhost', 5984, 'my_workhorse_couch');
    var wh = workhorse.create(datastore);

Server
------
Workhorse provides an HTTP server for GETting problems to solve, GETting solvers, and POSTing solutions
in a RESTful way. POSTing problems will be supported in the near future, as well.

Once a problem has been solved, the JSON returned from GETting the problem will include the solution.
The solution will also be POSTed to the URI with which it was registered. 

