var log_with_timestamp = require('util').log;

function log(message) {
    log_with_timestamp(message);
}

exports.log = log;
