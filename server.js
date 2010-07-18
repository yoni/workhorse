// some dependencies
var puts = require('sys').puts
var express = require('express')

// initialize the application
var app = express.createServer()

// homepage
app.get('/', function(req, res){
  res.send("here's a problem to chew on")
})

// solution submitted
app.post('/solution', function(req,res){
  res.send('got your solution. thanks for helping out')
})

// settings
var port = 3000
// fire it up
app.listen(port)
puts('Workhorse running at http://<your_domain>:' + port)
