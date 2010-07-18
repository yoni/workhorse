// some dependencies
var puts = require('sys').puts
var express = require('express')

// settings
var port = 3000

// initialize the application
var app = express.createServer()

// Routing:
app.get('/', function(request, response){
  response.send("<title>workhorse</title>here's a problem to chew on")
})
app.post('/solution', function(request,response){
  response.send('got your solution. thanks for helping out')
})

// fire it up
app.listen(port)

// log some useful details. TODO: replace this with real logging
puts('Workhorse running at http://<your_domain>:' + port)
puts('Environment is set to ' + app.set('env'))
