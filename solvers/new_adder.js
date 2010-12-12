(function(base) {

    function callback(data) {
        var solution = {};
        if (data) {
            solution.sum = data.a + data.b;
        }
        else {
            solution.error = true;
            solution.data = data;
        }

        postMessage({ solution: solution });
    }

    base.onmessage = function(msg) {
        if (msg.data) {
            postMessage({status: 'Calculating .', date: msg.data});
            callback(msg.data);
        }
        else {
            postMessage({error: 'Error: was expecting data.', msg: msg});
        }
    };

    base['callback'] = callback;

})(this);