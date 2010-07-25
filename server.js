var connect = require('connect'),
    express = require('express');

// initialize the app and fire it up
var app = express.createServer(
    connect.logger(),      // logs all requests
    connect.bodyDecoder()) // makes the POST body available using req.body

// configuration 
app.configure(function() {
    app.use('/static', connect.staticProvider(__dirname + '/static'))
    app.use('/solvers', connect.staticProvider(__dirname + '/solvers'))
  })

// routing
app.get('/', function(req, res){
    res.render('index.html.ejs')
  })
app.get('/problem', function(req,res){
    res.send(problem())
  })
app.post('/solution', function(req,res){
    try {
      console.log(req.header('Content-Type'))
      console.log("body:" + req.body)
      // TODO: store the solution
      var solution = req.body.solution
      var problem_id = req.body.problem_id
      res.send('got your solution for problem ' +  req.body.problem_id + '. thanks for helping out\n')
    }
    catch(err) {
      console.log(err)
    }
  })

// retreive a problem
function problem() {
  // TODO: load a problem from a persistent source
  return {id: '1', description: 'Add two numbers and send back the result', solver: 'adder', args: {a: 2, b: 3}}
}

var port = parseInt(process.env.PORT || 8000)
app.listen(port)

var environment = app.set('env')
console.log('Workhorse running at http://<your_domain>:' + port)
console.log('Environment is set to ' + environment) 
