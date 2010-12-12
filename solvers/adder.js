(function(base) {

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

    /**
     * @param data
     */
    function run(data) {
        var solution = {};
        if (data) {
            solution.sum = adder(data);
        }
        else {
            solution.error = true;
            solution.data = data;
        }

        postMessage({ solution: solution });
    }

    base.onmessage = function(msg) {
        if (msg.data) {
            postMessage({status: 'Calculating...', date: msg.data});
            run(msg.data);
        }
        else {
            postMessage({error: 'Error: was expecting data.', msg: msg});
        }
    };


})(this);