import chai = require("chai");
import watcher = require("../src/index");

var expect = chai.expect;

describe("node module tests", () => {
    it("will watch google.com and fire the callback", done => { 
        var options = {
            url: 'google.com'
        };
        var callback = (time) => {
            expect(time > 0).to.equal(true);
			w.stop();
            done();
        };
        var w = watcher.start(options, callback);
    });
});

describe("port validation tests", () => {
    inputTest("will invalidate a negative port number", watcher.isValidPort(-1), false);
    inputTest("will invalidate a port that is too high", watcher.isValidPort(65536), false);
    inputTest("will invalidate a port that is not a whole number", watcher.isValidPort(4.5), false);
    inputTest("will validate a port that is between 1 and 65535", watcher.isValidPort(1), true);
    inputTest("will invalidate a port that is not a number", watcher.isValidPort("foo"), false);
    inputTest("will invalidate a port that is 0", watcher.isValidPort(0), false);
});

describe("timeout validation tests", () => {
    inputTest("will invalidate a timeout below 0", watcher.isValidTimeout(-1), false);
    inputTest("will invalidate a timeout that is 0", watcher.isValidTimeout(0), false);
    inputTest("will validate a timeout above 0", watcher.isValidTimeout(0.1), true);
});

describe("interval validation tests", () => {
    inputTest("will invalidate an interval that is not a number", watcher.isValidInterval("foo"), false);
    inputTest("will invalidate an interval that is below 0", watcher.isValidInterval(-1), false);
    inputTest("will invaldiate an interval that is 0", watcher.isValidInterval(0), false);
    inputTest("will validate an interval that is above 0", watcher.isValidInterval(1), true);
});

function inputTest(message: string, input: boolean, expected: boolean): void {
    it(message, () => {
        expect(input).to.equal(expected);
    });
}
