var minimist = require("minimist");
var ping = require("node-http-ping");
var args = minimist(process.argv.slice(2));
if (args['help'] || args['h'])
    printHelp();
var isWatcherEnabled = false;
function start(options, callback) {
    var options = {
        url: options.url,
        port: options.port || 80,
        interval: options.interval || 10,
        timeout: options.timeout || 2
    };
    if (!options.url)
        throw "InvalidInputException: Url not supplied";
    if (!isValidParameters(options))
        throw "InvalidInputExpception: Invalid parameter supplied";
    if (!callback)
        throw "InvalidInputException: Callback not supplied";
    pingTick(true, options, callback);
    isWatcherEnabled = true;
    setTimeout(function () {
        pingTick(true, options, callback);
    }, options.interval * 1000);
}
exports.start = start;
function stop() {
    isWatcherEnabled = false;
}
exports.stop = stop;
function printHelp() {
    var c = console.log;
    c("Webserver watcher");
    c("");
    c("Usage: node src/index <url> [-p portNumber] [-i intervalSeconds] [-t timeoutSeconds]");
    c("");
    c("Options:");
    c("<url>\t\t\tdestination url. [required]");
    c("-p, --port\t\tport number. default: 80");
    c("-i, --interval\t\theartbeat interval in seconds. default: 10");
    c("-t, --timeout\t\tping timeout in seconds. default: 2");
    process.exit();
}
if (args['_']) {
    var options = {
        interval: args['i'] || args['interval'] || 10,
        port: args['p'] || args['port'] || 80,
        timeout: args['t'] || args['timeout'] || 2,
        url: args['_'][0]
    };
    if (!isValidParameters(options)) {
        console.log("watcher: Invalid parameters supplied.");
        printHelp();
    }
    console.log("Press CTRL+C to exit");
    setInterval(function () {
        pingTick(false, options);
    }, options.interval * 1000);
}
function pingTick(isModule, options, callback) {
    var timestamp = new Date().toTimeString().slice(0, 8);
    var pingPromise = ping(options.url, options.port);
    if (isModule) {
        pingPromise.tim;
        pingPromise.then(function (time) {
            callback(time);
        }).catch(callback(-1));
        if (isWatcherEnabled)
            setTimeout(function () {
                pingTick(true, options, callback);
            }, options.interval * 1000);
        return;
    }
    pingPromise.then(function (time) {
        console.log("[%s] [%s:%d] %dms", timestamp, options.url, options.port, time);
    }).catch(function () { return console.log("[%s:%d] Timed out after %dseconds", options.url, options.port, options.timeout); });
}
function isValidPort(value) {
    return (!isNaN(value) && value > 0 || value <= 65535);
}
function isValidTimeout(value) {
    return (!isNaN(value) && value > 0);
}
function isValidInterval(value) {
    return (!isNaN(value) && value > 0);
}
function isValidParameters(options) {
    if (!isValidPort(options.port)) {
        console.log("Invalid port number supplied. Must be in range 1 - 65535.");
        return false;
    }
    if (!isValidInterval(options.interval)) {
        console.log("Ping interval is invalid. Must be above zero (0).");
        return false;
    }
    if (!isValidTimeout(options.timeout)) {
        console.log("Ping timeout is invalid. Must be above zero (0).");
        return false;
    }
}
//# sourceMappingURL=index.js.map