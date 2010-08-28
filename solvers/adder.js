/**
 * A simple adder that takes two numbers: 'a' and 'b' and returns the sum
 */
function adder(args) {
    validate(args.a);
    validate(args.b);
    return args.a + args.b;
}

function validate(num) {
    if (!num || typeof num != 'number')
        throw 'Illegal argument. Expected a number, but got a ' + typeof num;
}

exports.solve = adder;
exports.description = 'Adds two numbers';
