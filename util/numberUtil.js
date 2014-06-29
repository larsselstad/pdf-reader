/*jshint node: true*/

var numberUtil = {
    between: function (number, a, b) {
        return (number > a && number < b);
    },
    almostEqual: function (a, b) {
        return a === b || a === (b + 1) || a === (b - 1);
    }
};

module.exports = numberUtil;