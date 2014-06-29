/*jshint node: true*/

var assert = require('assert'),
    numberUtil = require('../util/numberUtil');

module.exports = {
    betweenTest: function () {
        var between = numberUtil.between;

        assert.equal(between(4, 3, 5), true, '4 should be between 3 and 5');
        assert.equal(between(3, 3, 5), false, '4 should not be between 3 and 5');
        assert.equal(between(5, 3, 5), false, '5 should not be between 3 and 5');
    },
    almostEqualTest: function () {
        var almostEqual = numberUtil.almostEqual;

        assert.equal(almostEqual(4, 4), true, '4 should be almost equal 4');
        assert.equal(almostEqual(3, 4), true, '3 should be almost equal 4');
        assert.equal(almostEqual(5, 4), true, '5 should be almost equal 4');

        assert.equal(almostEqual(2, 4), false, '2 should not be almost equal 4');
        assert.equal(almostEqual(6, 4), false, '6 should not be almost equal 4');
    }
};