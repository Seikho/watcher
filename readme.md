## watcher
####### a simple web server watcher

## requirements
* node.js
* npm

## installation
    // node module
	npm install webwatcher

	// standalone tool
	git clone https://github.com/seikho/watcher
	cd watcher
	npm install

## usage
**use it as a node module**

    npm install webwatcher
    var watcher = require("webwatcher");
    var options = { url: 'google.com' };
    var callback = function(time) { console.log("Response time: %d", time); }
    watcher.start(options, callback);
	...
	watcher.stop();

   

**or use is as a cli tool**
	
    cd watcher
    node src/index www.google.com -t 2 -i 5
    
    // node src/index [url] [-p portNumber] [-t timeoutSeconds] [-i intervalSeconds]
    // url: destination url. E.g. www.google.com  
    // -p, --port: port number. default: 80  
    // -i, --interval: interval in seconds. default: 10  
    // -t, --timeout: timeout in seconds. default 2

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