var couchdb = require('couchdb');

exports.create = createDataStore;

function createDataStore(config) {
    var client = couchdb.createClient(config.port, config.host, config.key, config.password);
    var db = client.db(config.name);

    // Make sure the database can be accessed
    db.exists(function (err, exists) {
        if(err) {
            throw err;
        }
        else if (!exists)  {
            throw new Error('DB does not exist. DB config: ' + JSON.stringify(config));
        }
    });

    function has(problem_id, callback) {
        db.getDoc(problem_id, function(couch_err, problem) {
            var result;

            if (couch_err && couch_err.error === 'not_found') {
                callback(null, false);
            }
            else if (couch_err) {
                callback(couch_err);
            }
            else if (!problem) {
                callback('CouchDB did not return an error, but the document is undefined.');
            }
            else {
                callback(null, true);
            }

        });
    }

    function set(problem_id, problem, callback) {
        db.saveDoc(problem_id, problem, function(err, ok) {
            if (err) {
                callback(err);
            }
            else if (!ok) {
                callback(ok);
            }
            else {
                callback(err, problem);
            }
        });
    }

    function get(problem_id, callback) {
        db.getDoc(problem_id, function(err, doc) {
            if (err) {
                callback(err);
            }
            else {
                callback(err, doc);
            }
        });
    }

    return {
        get: get,
        set: set,
        has: has
    };
}

