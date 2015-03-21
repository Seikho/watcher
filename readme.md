## watcher
###### a simple web server watcher

## requirements
* node.js
* npm

## installation

### node module
	npm install webwatcher

### standalone tool
	git clone https://github.com/seikho/watcher
	cd watcher
	npm install

### global command line
	npm install -g webwatcher

## usage
### node module 
Note: all times are in seconds

    npm install webwatcher
    var watcher = require("webwatcher");
    var options = { url: 'google.com', timeout: 2, interval: 5, port: 80 };
	var options2 = { url: 'bing.com', timeout: 2, interval: 5, port: 80 };

    var callback = function(time) { console.log("Google: Response time: %d", time); }
	var callback2 = function(time) { console.log("Bing: Response time: %d", time); }

    var w1 = watcher.start(options, callback);
	var w2 = watcher.start(options, callback2);
	...
	w.stop();
	w2.stop();
   

### Local command line
	
    cd watcher
    node src/index www.google.com -t 2 -i 5

### Global command line

	[from anywhere...]
	webwatcher google.com -p 80 -t 2 -i 10
    
    // node src/index [url] [-p portNumber] [-t timeoutSeconds] [-i intervalSeconds]
    // url: destination url. E.g. www.google.com  
    // -p, --port: port number. default: 80  
    // -i, --interval: interval in seconds. default: 10  
    // -t, --timeout: timeout in seconds. default 2
    // -s, --silent: run silently, do not produce console output.

## license

Copyright (c) 2015 Carl Winkler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
