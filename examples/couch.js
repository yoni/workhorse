var express = require('express'),
    connect = require('connect'),
    workhorse = require('../workhorse'),
    couch_store = require('../lib/datastores/couchdb');

function registrationCallback(err) {
  if(err)
    console.log(err);
}

var datastore = couch_store.create({host: 'localhost', port: 5984, db_name: 'my_workhorse_couch'});
var wh = workhorse.create(datastore);

// Register two problems to be solved
wh.register(
  'add_two_numbers',
  'adder',
  'http://localhost:9999/solution_callback',
  {a:1, b:3},
  registrationCallback);

wh.register(
  'add_two_more_numbers',
  'adder',
  'http://localhost:9999/solution_callback',
  {a:2, b:3},
  registrationCallback);

// Fire up a server to handle problem and solver GETs, and solution POSTs. See workhorse.js for more details.
wh.createServer().listen(8000);

// Create a server to listen to solution results
var userServer = express.createServer(connect.logger());
userServer.post('/solution_callback', function(req, res){
    res.send('got the solution!');
  });
userServer.listen(9999);
