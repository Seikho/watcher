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
            watcher.stop();
            done();
        };
        watcher.start(options, callback);
    });
});
