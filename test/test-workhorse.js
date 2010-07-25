var assert = require('./assert'),
    puts = require('sys').puts,
    http = require('http');


// TODO: test that we can get a problem
// TODO: test that the homepage is responsive
// TODO: test that we can submit a solution
var port = 8000

function testGet(url, expectedContentRegex, description) {
  puts(description)
  http.cat("http://localhost:" + port + "/" + url, "utf8", function (err, content) {
    if (err) {
      puts('Test failed: ' + description + '\n' + err) 
      throw err
    }
    else {
      assert.contains(expectedContentRegex, content)
    }
  });
}

testGet(
    '',
    /<title>Workhorse<\/title>/,
    'Test that homepage responds')
testGet(
    'problem', 
    /{"id":"1","description":"Add two numbers and send back the result","solver":"adder","args":{"a":2,"b":3}}/,
    'Test that you can get the silly problem'
    )

process.addListener("exit", function () {
  puts("Tests complete.")
})

