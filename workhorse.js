// retreives a solver
function getSolver(name) {
  // TODO: load the solver from a persistent source
  if(name === 'adder') {
    return function(args) {
      return args.a + args.b
    }
  }
  throw 'Could not find a solver with name ' + name
}

// retreives a problem
function getProblem() {
  // TODO: load a problem from a persistent source
  return {id: '1', description: 'Add two numbers and send back the result', solver: 'adder', args: {a: 2, b: 3}}
}

exports.solver = getSolver
exports.problem = getProblem
