// some dependencies
var puts = require('sys').puts,
    connect = require('connect'),
    express = require('express');

// initialize the app and fire it up
var app = express.createServer()

// configuration 
app.configure(function() {
    app.set("root", __dirname)  
    app.use('/static', connect.staticProvider(__dirname + '/static'))
    app.use('/solvers', connect.staticProvider(__dirname + '/solvers'))
  })
app.configure('development', function(){
    app.enable('reload views', 5000)
  })

// routing
app.get('/', function(req, res){
    res.render('index.html.ejs')
  })
app.get('/problem', function(req,res){
    res.send(problem())
  })
app.post('/solution', function(req,res){
    res.send('got your solution for problem. thanks for helping out')
  })

// helper functions. TODO: move this out of here
function requiredParam(name, req) {
  var param = req.param(name)
  if(!param) throw 'Required parameter ' + name + ' is missing.'
  return param 
}

// retreive a problem
function problem() {
  // TODO: load a problem from a persistent source
  return {id: '1', description: 'Add two numbers and send back the result', solver: 'adder', args: {a: 2, b: 3}}
}

var port = parseInt(process.env.PORT || 8000)
app.listen(port)
// log some useful details. TODO: replace this with real logging
puts('Workhorse running at http://<your_domain>:' + port)
puts('Environment is set to ' + app.set('env'))
