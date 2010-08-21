var sys = require('sys'),
couchdb_datastore = require('../../../lib/datastores/couchdb'),
couchdb = require('node-couchdb/lib/couchdb');

var callbackURI = 'http://localhost:8000/404';

// TODO: create the db and destroy it at the end
var client = couchdb.createClient(5984, 'localhost');

// Create the 'workhorse_test' db. Drop it if it already s
var db = client.db('workhorse_test');

function newDatastore() {
	return couchdb_datastore.create('localhost', 5984, 'workhorse_test');
}

module.exports = {
	'datastore constructor works' : constructor,
	'datastore supports set verb' : set,
	'datastore supports get verb' : get,
	'datastore supports has' : has
};

function remove(key, rev) {
  db.removeDoc(key, rev, function(err, ok) {
      if (err)
        throw new Error('Could not remove the doc ' + key);
    });
}

function constructor(assert) {
	var store = newDatastore();
	assert.ok(store);
	assert.ok(store.has);
	assert.ok(store.get);
	assert.ok(store.set);
}

function set(assert, beforeExit) {

	var set_worked;
	var error;

	var store = newDatastore();

	var key = 'document_for_set';

	// 1. Set the problem
	store.set(key, {
		hi: 'hi'
	},
	function(err, problem) {
		if (!err) {

			if (!problem) {
				throw new Error('Did not get back the problem after registration, but the registration' + ' completed and returned no error');
			}
			// 2. Try and get the problem
			db.getDoc(key, function(err, doc) {
				if (err) {
					throw new Error('Set worked, but could not get the doc with couchdb client.');
				}
				else {
					if (doc.hi === 'hi') {
						// 3. Cleanup - remove the problem
						remove(key, doc._rev);
						set_worked = true;
					}
				}
			});
		}
		else {
			error = err;
		}
	});

	beforeExit(function() {
		assert.ok(!error, JSON.stringify(error));
		assert.ok(set_worked, 'Could not add a problem');
	});

}

function get(assert, beforeExit) {

	var get_worked;
	var error;

	var store = newDatastore();

	var key = 'document_for_get';

	// 1. Set the problem
	store.set(key, {
		hi: 'hi'
	},
	function(err, problem) {
		if (!err) {

			// 2. Try to get the problem
			store.get(key, function(err, doc) {
				if (err) {
					throw new Error('Set worked, but could not get the doc with "get".');
				}
				else {
					if (doc.hi === 'hi') {
						// 3. Cleanup - remove the problem
            remove(key,doc._rev);
						get_worked = true;
					}
				}
			});
		}
		else {
			error = err;
		}
	});

	beforeExit(function() {
		assert.ok(!error, JSON.stringify(error));
		assert.ok(get_worked, 'Could not add a problem');
	});

}

function has(assert, beforeExit) {
	var key = 'document_for_has';
  var error;
  var has_worked = false;
  
	var store = newDatastore();

  // 1. Add a document
  db.saveDoc('document_for_has',
    {
      hi: 'hi'
    },
    function(err, ok) {
      if(err)
        throw new Error(JSON.stringify(err));

      // 2. Check that has finds that document
      store.has(key, function(err,result) {

          has_worked = result;
          
          // 3. Cleanup = remove the document 
          remove(key, ok.rev);

        });
    });
    
	beforeExit(function() {
		assert.ok(!error, JSON.stringify(error));
		assert.ok(has_worked, 'Has did not work');
	});
}

