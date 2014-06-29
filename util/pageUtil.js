/*jshint node: true*/

var numberUtil = require('./numberUtil');

function safePrint(value) {
    return value || '';
}

function formatPhoneNumber(phoneNumber) {
    var phoneNumberTrimmed = phoneNumber.trim();

    if (phoneNumberTrimmed.length !== 8) {
        return phoneNumberTrimmed + ' er for kort';
    }

    var firstChar = phoneNumberTrimmed.substr(0, 1);

    if (firstChar === '2' || firstChar === '8') {
        return phoneNumberTrimmed.substr(0, 2) + ' ' + phoneNumberTrimmed.substr(2, 2) + ' ' + phoneNumberTrimmed.substr(4, 2) + ' ' + phoneNumberTrimmed.substr(6, 2);
    } else if (firstChar === '9' || firstChar === '4') {
        return phoneNumberTrimmed.substr(0, 3) + ' ' + phoneNumberTrimmed.substr(3, 2) + ' ' + phoneNumberTrimmed.substr(5);
    } else {
        return 'PhoneNumber not changed: "' + phoneNumber + '"';
    }
}

var pageUtil = {
    extractPage: function (grid) {
        var lastY,
            rowArray;

        return function (textValue) {
            var text = decodeURIComponent(textValue.R[0].T).trim();
            var circaX = parseInt(textValue.x, 10);
            var circaY = Math.round(parseFloat(textValue.y) * 10);

            //console.log(circaY + ' ' + textValue.y + ' ' + text);
            //console.log(circaX + ' ' + textValue.x + ' ' + text);

            if (!numberUtil.almostEqual(lastY, circaY)) {
                rowArray = new Array(7);

                grid.push(rowArray);
            }

            /*  9 Navn
            27 Praksisadr
            49 Postadresse
            64 Poststed
            74 Tlf. praksis
            86 Avtale
            92 Kommentar*/

            if (numberUtil.between(circaX, 7, 27)) {
                rowArray[0] = text;
            } else if (numberUtil.between(circaX, 26, 49)) {
                rowArray[1] = text;
            } else if (numberUtil.between(circaX, 48, 64)) {
                rowArray[2] = text;
            } else if (numberUtil.between(circaX, 63, 73)) {
                rowArray[3] = text;
            } else if (numberUtil.between(circaX, 72, 86)) {
                rowArray[4] = text;
            } else if (numberUtil.between(circaX, 85, 92)) {
                rowArray[5] = text;
            } else if (numberUtil.between(circaX, 91, 120)) {
                rowArray[6] = text;
            } else {
                console.log('else: ' + circaX + ' ' + text);
            }

            lastY = circaY;
        };
    },

    phoneNumber: function (phoneNumber) {
        if (phoneNumber.indexOf('/') === -1) {
            return formatPhoneNumber(phoneNumber);
        } else {
            var phoneNumberSplit = phoneNumber.split('/');

            return formatPhoneNumber(phoneNumberSplit[0]) + ' / ' + formatPhoneNumber(phoneNumberSplit[1]);
        }
    },

    objectifyArray: function (array) {
        return {
            name: safePrint(array[0]),
            workAdress: safePrint(array[1]),
            mailAdress: safePrint(array[2]),
            mailPostal: safePrint(array[3]),
            phone: this.phoneNumber(safePrint(array[4])),
            time: safePrint(array[5]),
            comment: safePrint(array[6])
        };
    },

    extractData: function (grid, categories) {
        if (!categories) {
            console.error('extractData needs categories');
        }

        var pageUtil = this,
            data = {},
            currentCategory;

        grid.forEach(function (row, i) {
            var r = row.filter(function (el) {
                return el !== '';
            });

            if (r.length === 1 && i === 0) {
                console.log('Legger inn sist endret');

                data.lastUpdate = r[0];
            } else if (r.length === 1) {
                console.log('1 celle: ' + r);

                if (categories.hasOwnProperty(r[0])) {
                    console.log('Legger til kategori: ' + r[0]);

                    currentCategory = r[0];

                    data[currentCategory] = [];
                }
            } else {
                if (data[currentCategory]) {
                    console.log('Legger til rad: ' + row + ' i kategori: ' + currentCategory);
                    data[currentCategory].push(pageUtil.objectifyArray(row));
                } else {
                    console.log('Rad som ikke er i en kategori: ' + row);
                }
            }
        });

        return data;
    }
};

module.exports = pageUtil;