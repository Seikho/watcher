var chai = require("chai");
var watcher = require("../src/index");
var expect = chai.expect;
describe("node module tests", function () {
    it("will watch google.com and fire the callback", function (done) {
        var options = {
            url: 'google.com'
        };
        var callback = function (time) {
            expect(time > 0).to.equal(true);
            watcher.stop();
            done();
        };
        watcher.start(options, callback);
    });
});
//# sourceMappingURL=index.js.map