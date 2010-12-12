var express = require('express'),
    connect = require('connect'),
    workhorse = require('../workhorse'),
    log = require('util').log,
    couch_store = require('../lib/datastores/couchdb');

var host = 'localhost';
var port = 5984;
var db_name = 'my_workhorse_couch';

var problem_id = 'add_two_numbers';

var datastore = couch_store.create({host: host, port: port, db_name: db_name});
var wh = workhorse.create(datastore);

run();

// First, we post a problem and get it
// Then we post a solution and get it
function run() {

    wh.postProblem(
        problem_id,
        'adder',
        {a:1, b:3},
        function(err) {
            if (err) {
                log(err);
                throw err;
            }
            else {
                log('Posted a problem');
                wh.getProblem(function(error, problem) {
                    if (error) {
                        throw error;
                    }
                    else {
                        log('Got a problem.');
                        // Now we solve the problem and get the solution
                        postASolutionAndGetIt(problem);
                    }
                });
            }
        });

}

// Next, we post a solution and get it
function postASolutionAndGetIt(problem) {
    wh.postSolution({solution:problem.data.a + problem.data.b, problem_id: problem_id}, function(err) {
        if (err) {
            log(err);
            throw err;
        }
        else {
            log('Posted the solution.');
            wh.getSolution(problem_id, function(err, solution) {
                if (err) {
                    throw err;
                }
                else {
                    log('Got the solution.');
                    cleanup();
                }
            });
        }
    });
}

function cleanup() {
    var client = require('couchdb').createClient(port, host);

    // Create the 'workhorse_test' db. Drop it if it already s
    var db = client.db(db_name);

    var doc_key = problem_id;
    db.getDoc(doc_key, function(couch_err, doc) {

        if (couch_err && couch_err.error === 'not_found') {
            callback(null, false);
        }
        else if (couch_err) {
            callback(couch_err);
        }
        else if (!doc) {
            callback('CouchDB did not return an error, but the document is undefined.');
        }
        else {
            db.removeDoc(doc_key, doc._rev, function(err, ok) {
                if (err)
                    throw new Error('Could not remove the doc ' + doc_key);
            });
        }

    });

}
