/// <reference path="typings/tsd.d.ts" />
var minimist = require("minimist");
var ping = require("node-http-ping");
var args = minimist(process.argv.slice(2));
if (args['help'] || args['h'])
    printHelp();
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
// Must provide a destination url
if (!args['_']) {
    console.log("No destination url supplied");
    printHelp();
}
var interval = args['i'] || args['interval'] || 10;
var port = args['p'] || args['port'] || 80;
var timeout = args['t'] || args['timeout'] || 2;
var url = args['_'][0];
// Port number must be a number and valid (1-65535)
if (isNaN(port) || port <= 0 || port > 65535) {
    console.log("Invalid port number supplied. Must be in range 1 - 65535.");
    printHelp();
}
// Interval must be a number and above 0.
if (isNaN(interval) || interval <= 0) {
    console.log("Ping interval is invalid. Must be above zero (0).");
    printHelp();
}
// Timeout must be a number and above 0.
if (isNaN(timeout) || timeout <= 0) {
    console.log("Ping timeout is invalid. Must be above zero (0).");
    printHelp();
}
console.log("Press CTRL+C to exit");
setInterval(pingTick, interval * 1000);
pingTick();
function pingTick() {
    var timestamp = new Date().toTimeString().slice(0, 8);
    ping(url, port).timeout(timeout * 1000).then(function (time) {
        console.log("[%s] [%s:%d] %dms", timestamp, url, port, time);
    }).catch(function () { return console.log("[%s:%d] Timed out after %dseconds", url, port, timeout); });
}
//# sourceMappingURL=index.js.map