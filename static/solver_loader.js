(function(){

// Get a problem and send it to be solved
jQuery.getJSON('/problem', function(problem) {
  console.log('Got problem:');
  console.log(problem);
  solve(problem); 
});

/**
 * In order to solve the problem, we:
 * 1. Get the solver using CommonJS 'require'
 * 2. Run the solver using a webworker (TODO: really use a web worker)
 * 3. Post the solution to /solutions
 */
function solve(problem) {
  require.ensure(['solvers/' + problem.solver], function(require) {
    var solver = require('solvers/' + problem.solver);
    console.log('solver:');
    console.log(solver);
    var solution = solver.solve(problem.args);
    console.log('solution:');
    console.log(solution);
  });
}

})();
