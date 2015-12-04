#!/usr/bin/env node

var watcher = require("../src/index.js");
var minimist = require("minimist");

var args = minimist(process.argv.slice(2));
if (args['help'] || args['h']) printHelp();

if (args['_'] && args['_'].length > 0) {
	
	// Compose the 'options' object
	var options = {
		interval: args['i'] || args['interval'] || 10,
		port: args['p'] || args['port'] || 80,
		timeout: args['t'] || args['timeout'] || 2,
		url: args['_'][0],
		silent: !!args['s'] || !!args['silent'] || false
	};

	if (!watcher.isValidParameters(options)) {
		console.log("watcher: Invalid parameters supplied.");
		
		// printHelp will terminate the process 
		printHelp();
	}

	console.log("Webserver Watcher");
	console.log("Press CTRL+C to exit");
	var watcher = watcher.start(options, null);
}
else printHelp();

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