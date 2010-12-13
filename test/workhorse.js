var test_server = require('./test_support/test_server'),
    assert = require('assert'),
    soda = require('soda');

var tests_passed = false;
var server;
var port = 3000;

function runSodaTest() {

    var browser = soda.createClient({
        host: 'localhost'
      , port: 4444
      , url: 'http://localhost:' + port
      , browser: 'firefox'
    });

    browser
      .chain
      .session()
      .open('/')
      .waitForText('css=p.problems_solved')
      .verifyText('css=p.problems_solved', '1')
      .testComplete()
      .end(function(err){
          if (err) throw err;
          tests_passed = true;
          server.app.close();
      });

}

module.exports = {
    'GET problem': function(beforeExit) {
        server = test_server.setUpWorkhorseServer(port);

        runSodaTest();

        beforeExit( function() {
            assert.ok(tests_passed);
        });
    }
};

