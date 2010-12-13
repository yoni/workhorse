var test_server = require('./test_support/test_server'),
    soda = require('soda');

test_server.setUpWorkhorseServer(3000);

function runSodaTest() {

    var browser = soda.createClient({
        host: 'localhost'
      , port: 4444
      , url: 'http://localhost:3000'
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

setTimeout(runSodaTest(), 500);
