var assert = require('assert');

assert.contains = function(regex, str, message) {
  var m = 'Did not find text [' + regex + '] in str [' + str + ']' 
  assert.ok(str.search(regex) != -1, message ? message + ' ' + m : m)
}

module.exports = assert;
