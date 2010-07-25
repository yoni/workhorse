var assert = require('./assert'),
    puts = require('sys').puts,
    http = require('http');

// TODO: move this out of here and into a common utils file
function request(method, path, body, callback) {
  var headers = {
    'Host'          : 'localhost',
    'Content-Type'  : 'application/json'
  };

  if (method == 'POST') {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    headers['Content-Length'] = body.length;
  }

  var client  = http.createClient(8000, 'localhost');
  var request = client.request(method, path, headers);

  if (typeof(callback) == 'function') {
    request.addListener('response', function(response) {
        var data = '';

        response.addListener('data', function(chunk) {
            data += chunk;
          });
        response.addListener('end', function() {
          try {
            data = JSON.parse(data);
          } catch(e) {}
            callback(data);
          });
        });
  }

  if (method == 'POST') {
    request.write(body);
  }

  request.end();
}

var got_response_for_solution = false;
request('POST', '/solution', {solution:5, problem_id:1}, function(data) {
    got_response_for_solution = true;
    console.log('Got response');
    console.log(data);
    assert.contains(/got your solution for problem 1. thanks for helping out/, data);
  });

process.addListener("exit", function () {
  assert.ok(got_response_for_solution)
  puts('Tests done')
});

