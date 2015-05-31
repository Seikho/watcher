var ping = require("node-http-ping");

export function start(options: WatchOptions, callback: (time) => any): Watcher {
	var options: WatchOptions = {
		url: options.url,
		port: options.port || 80,
		interval: options.interval || 10,
		timeout: options.timeout || 2
	}
	if (!options.url) throw "InvalidInputException: Url not supplied";
	if (!isValidParameters(options)) throw "InvalidInputExpception: Invalid parameter supplied";

	// Initiate the watcher
	var watcher = new Watcher(options, callback);
	watcher.start();
	return watcher;
}

export interface WatchOptions {
	url: string;
	port?: number;
	interval?: number;
	timeout?: number;
	silent?: boolean;
}

class Watcher {
	constructor(options: WatchOptions, callback?: (arg: number) => any) {
		this.interval = options.interval;
		this.port = options.port;
		this.url = options.url;
		this.timeout = options.timeout;
		this.silent = options.silent || false;
		this.callback = callback || null;
		this.isEnabled = true;
	}

	isEnabled: boolean;
	isModule: boolean;
	interval: number;
	timeout: number;
	url: string;
	port: number;
	silent: boolean;
	callback: (time: number) => any;

	start(): void {
		this.isEnabled = true;
		this.pingTick();
	}
	stop(): void {
		this.isEnabled = true;
	}

	pingTick(): void {
		var timestamp = new Date().toTimeString().slice(0,8);
		var pingPromise = ping(this.url, this.port).timeout(this.timeout*1000);

		// If this is consumed as a node module, execute the callback provided instead of considering stdout
		if (this.callback !== null) {
			pingPromise.then(time => {
				this.callback(time);
			}).catch(() => {
				this.callback(-1);
			})
			this.queueTick();
			return;
		}
		
		// There is no callback, we consider printing the result to console
		pingPromise.then(time => {
			if (!this.silent) console.log("[%s] [%s:%d] %dms", timestamp, this.url, this.port, time);
		}).catch(() => { 
			if (!this.silent) console.log("[%s:%d] Timed out after %d second(s)", this.url, this.port, this.timeout); 
		});
		this.queueTick();
	}

	queueTick(): void {
		setTimeout(() => { this.pingTick(); } , this.interval*1000);
	}
}

export function isValidPort(value: number) {
    return (!isNaN(value) && Math.floor(value) === value && value > 0 && value <= 65535);
}

export function isValidTimeout(value: number) {
	return (!isNaN(value) && value > 0);
}

export function isValidInterval(value: number) {
	return (!isNaN(value) && value > 0);
}

export function isValidParameters(options: WatchOptions) {
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

