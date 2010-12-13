var test_server = require('./test_support/test_server'),
    soda = require('soda');

var port = 3000;
test_server.setUpWorkhorseServer(port);

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
          console.log('done');
          process.exit(0);
      });

}

// wait for the workhorse server to come up
setTimeout(runSodaTest(), 500);
