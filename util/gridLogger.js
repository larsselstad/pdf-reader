/*jshint node: true*/

var fs = require('fs');

module.exports = function (grid) {
    var dataLogFiles = [
            null,
            fs.createWriteStream('./l1.txt'),
            fs.createWriteStream('./l2.txt'),
            fs.createWriteStream('./l3.txt'),
            fs.createWriteStream('./l4.txt'),
            fs.createWriteStream('./l5.txt'),
            fs.createWriteStream('./l6.txt'),
            fs.createWriteStream('./l7.txt')
        ];

    grid.forEach(function (row, i) {
        var r = row.filter(function (el) {
            return el != null;
        });

        dataLogFiles[r.length].write(i + '. ' + r + '\n');
        dataLogFiles[r.length].write('-----\n');
    });

    dataLogFiles.forEach(function (file) {
        if (file) {
            file.end();
        }
    });
};