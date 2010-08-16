var workhorse = require('../workhorse').create();

// Register a problem. The problem will be queued and the callback will be called once it's solved.
workhorse.register(
  'add_two_numbers',
  'adder',
  null,
  {a:1, b:3},
  function(err) {
    if(err)
      console.log(err);
  });

// Fire up a server to handle problem and solver GETs, and solution POSTs. See workhorse.js for more details.
workhorse.createServer().listen(8000);

