var couchdb = require('node-couchdb/lib/couchdb');

exports.createDataStore = createDataStore;

function createDataStore(host,port,db) {
  var client = couchdb.createClient(port, host),
      db = client.db(db);

  function has(problem_id, callback) {
    db.getDoc(problem_id, function(err, problem) {
        var result = problem ? true : false;
        callback(err, result);
      });
  }

  function set(problem_id, problem, callback) {
    db.saveDoc(problem_id, problem, function(err,ok) {
        if(err) {
          callback(err);
        }
        else if(!ok) {
          callback(ok);
        }
        else {
          callback(err,problem);
        }
      });
  } 

  function get(problem_id, callback) {
    db.getDoc(problem_id, function(err, doc) {
        if(err) {
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

