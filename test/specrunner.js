/*jshint node: true*/

function runTest(testObj) {
    for (var test in testObj) {
        if (testObj.hasOwnProperty(test)) {
            testObj[test]();
        }
    }
}

runTest(require('./numberUtil.test'));
runTest(require('./pageUtil.test'));