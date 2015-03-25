var minimist = require("minimist");
var ping = require("node-http-ping");
var args = minimist(process.argv.slice(2));
if (args['help'] || args['h'])
    printHelp();
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
    var watcher = new Watcher(options, true, callback);
    watcher.start();
    return watcher;
}
exports.start = start;
var Watcher = (function () {
    function Watcher(options, isModule, callback) {
        this.isModule = isModule;
        this.interval = options.interval;
        this.port = options.port;
        this.url = options.url;
        this.timeout = options.timeout;
        this.silent = options.silent || false;
        this.callback = callback || null;
        this.isEnabled = true;
    }
    Watcher.prototype.start = function () {
        this.isEnabled = true;
        this.pingTick();
    };
    Watcher.prototype.stop = function () {
        this.isEnabled = true;
    };
    Watcher.prototype.pingTick = function () {
        var _this = this;
        var timestamp = new Date().toTimeString().slice(0, 8);
        var pingPromise = ping(this.url, this.port).timeout(this.timeout * 1000);
        if (this.isModule) {
            pingPromise.then(function (time) {
                _this.callback(time);
            }).catch(function () {
                _this.callback(-1);
            });
            this.queueTick();
            return;
        }
        pingPromise.then(function (time) {
            if (!_this.silent)
                console.log("[%s] [%s:%d] %dms", timestamp, options.url, options.port, time);
        }).catch(function () {
            if (!_this.silent)
                console.log("[%s:%d] Timed out after %dseconds", options.url, options.port, options.timeout);
        });
        this.queueTick();
    };
    Watcher.prototype.queueTick = function () {
        var _this = this;
        setTimeout(function () {
            _this.pingTick();
        }, this.interval * 1000);
    };
    return Watcher;
})();
function printHelp() {
    var c = console.log;
    c("Webserver watcher");
    c("");
    c("Usage: node src/index <url> [-p portNumber] [-i intervalSeconds] [-t timeoutSeconds] [-s]");
    c("");
    c("Options:");
    c("<url>\t\t\tdestination url. [required]");
    c("-p, --port\t\tport number. default: 80");
    c("-i, --interval\t\theartbeat interval in seconds. default: 10");
    c("-t, --timeout\t\tping timeout in seconds. default: 2");
    c("-s, --silent\t\trun silently.");
    process.exit();
}
if (args['_'] && args['_'].length > 0) {
    var options = {
        interval: args['i'] || args['interval'] || 10,
        port: args['p'] || args['port'] || 80,
        timeout: args['t'] || args['timeout'] || 2,
        url: args['_'][0],
        silent: !!args['s'] || !!args['silent'] || false
    };
    if (!isValidParameters(options)) {
        console.log("watcher: Invalid parameters supplied.");
        printHelp();
    }
    console.log("Webserver Watcher");
    console.log("Press CTRL+C to exit");
    var watcher = new Watcher(options, false, null);
    watcher.start();
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
    return true;
}
//# sourceMappingURL=index.js.map