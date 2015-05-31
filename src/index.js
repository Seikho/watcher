var ping = require("node-http-ping");
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
    // Initiate the watcher
    var watcher = new Watcher(options, callback);
    watcher.start();
    return watcher;
}
exports.start = start;
var Watcher = (function () {
    function Watcher(options, callback) {
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
        // If this is consumed as a node module, execute the callback provided instead of considering stdout
        if (this.callback !== null) {
            pingPromise.then(function (time) {
                _this.callback(time);
            }).catch(function () {
                _this.callback(-1);
            });
            this.queueTick();
            return;
        }
        // There is no callback, we consider printing the result to console
        pingPromise.then(function (time) {
            if (!_this.silent)
                console.log("[%s] [%s:%d] %dms", timestamp, _this.url, _this.port, time);
        }).catch(function () {
            if (!_this.silent)
                console.log("[%s:%d] Timed out after %d second(s)", _this.url, _this.port, _this.timeout);
        });
        this.queueTick();
    };
    Watcher.prototype.queueTick = function () {
        var _this = this;
        setTimeout(function () { _this.pingTick(); }, this.interval * 1000);
    };
    return Watcher;
})();
function isValidPort(value) {
    return (!isNaN(value) && Math.floor(value) === value && value > 0 && value <= 65535);
}
exports.isValidPort = isValidPort;
function isValidTimeout(value) {
    return (!isNaN(value) && value > 0);
}
exports.isValidTimeout = isValidTimeout;
function isValidInterval(value) {
    return (!isNaN(value) && value > 0);
}
exports.isValidInterval = isValidInterval;
function isValidParameters(options) {
    // Port number must be a number and valid (1-65535)
    if (!isValidPort(options.port)) {
        console.log("Invalid port number supplied. Must be in range 1 - 65535.");
        return false;
    }
    // Interval must be a number and above 0.
    if (!isValidInterval(options.interval)) {
        console.log("Ping interval is invalid. Must be above zero (0).");
        return false;
    }
    // Timeout must be a number and above 0.
    if (!isValidTimeout(options.timeout)) {
        console.log("Ping timeout is invalid. Must be above zero (0).");
        return false;
    }
    return true;
}
exports.isValidParameters = isValidParameters;
