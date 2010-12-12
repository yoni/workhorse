// Some helpers around managing a queue of available clients

module.exports = {
    num:num,
    get:get,
    add:add,
    remove:remove
};

// A hash of available clients
var available_clients = {};

/**
 * Get the number of available clients.
 */
function num() {
    return Object.keys(available_clients).length;
}

/**
 * Get an available client.
 */
function get() {
    var keys = Object.keys(available_clients);
    if(keys.length) {
        var client = available_clients[keys[0]];
        delete available_clients[keys[0]];
        return client;
    }
}

/**
 * Remove a client from the queue.
 * @param client
 */
function remove(client) {
    delete available_clients[client.sessionId];
}

/**
 * Add a client to the queue.
 * @param client
 */
function add(client) {
    available_clients[client.sessionId] = client;
}
