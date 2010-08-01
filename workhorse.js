var connect = require('connect'),
    express = require('express');

function workhorse(args) {
  // initialize the app and fire it up
  var app = express.createServer(
      connect.logger(),      // logs all requests
      connect.bodyDecoder()) // makes the POST body available using req.body

  console.log(__dirname);
  // configuration 
  app.configure(function() {
      app.set('views', __dirname + '/views')
      app.use('/static', connect.staticProvider(__dirname + '/static'))
      app.use('/solvers', connect.staticProvider(__dirname + '/solvers'))
    })

  // routing
  app.get('/', function(req, res){
      res.render('index.html.ejs')
    })
  app.get('/problem', function(req,res){
      args.problem(function(problem) {
          res.send(problem)
        })
    })
  app.post('/solution', function(req,res){
      // TODO: store the solution
      var solution = req.body.solution
      var problem_id = req.body.problem_id
      args.solution(solution, problem_id, function(text) {
          res.send(text)
        })
    })

  return app
}

module.exports = workhorse
