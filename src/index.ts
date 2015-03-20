/// <reference path="typings/tsd.d.ts" />
import minimist = require("minimist");
var ping = require("node-http-ping");

var args = minimist(process.argv.slice(2));
if (args['help'] || args['h']) printHelp();

var isWatcherEnabled: boolean = false;

//TODO Convert to class to create multiple watcher instances

export function start(options: WatchOptions, callback: (time) => any) {
    var options: WatchOptions = {
        url: options.url,
        port: options.port || 80,
        interval: options.interval || 10,
        timeout: options.timeout || 2
    }
    if (!options.url) throw "InvalidInputException: Url not supplied";
    if (!isValidParameters(options)) throw "InvalidInputExpception: Invalid parameter supplied";
    if (!callback) throw "InvalidInputException: Callback not supplied";

    // Initiate the watcher
    pingTick(true, options, callback);
    isWatcherEnabled = true;
    setTimeout(() => { pingTick(true, options, callback) }, options.interval*1000);
}

export function stop() {
    isWatcherEnabled = false;
}

export interface WatchOptions {
    url: string;
    port?: number;
    interval?: number;
    timeout?: number;
    silent?: boolean;
}

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
    }

    if (!isValidParameters(options)) {
        console.log("watcher: Invalid parameters supplied.");
        printHelp();
    }

    console.log("Press CTRL+C to exit");
    pingTick(false, options);
    setInterval(() => { pingTick(false, options); }, options.interval*1000);
}

function pingTick(isModule: boolean, options?: WatchOptions, callback?: (arg) => any) {
    var timestamp = new Date().toTimeString().slice(0,8);
    var pingPromise = ping(options.url, options.port).timeout(options.timeout*1000);

    if (isModule) {
        pingPromise.then(time => {
            callback(time);
        }).catch(() => {
            callback(-1);
        })
        if (isWatcherEnabled) setTimeout(() => { pingTick(true, options, callback) }, options.interval*1000);
        return;
    }
    pingPromise.then(time => {
        if (!options.silent) console.log("[%s] [%s:%d] %dms", timestamp, options.url, options.port, time);
    }).catch(() => console.log("[%s:%d] Timed out after %dseconds", options.url, options.port, options.timeout));
}

function isValidPort(value: number) {
    return (!isNaN(value) && value > 0 || value <= 65535);
}

function isValidTimeout(value: number) {
    return (!isNaN(value) && value > 0);
}

function isValidInterval(value: number) {
    return (!isNaN(value) && value > 0);
}

function isValidParameters(options: WatchOptions) {
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

