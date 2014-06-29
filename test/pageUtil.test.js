/*jshint node: true*/

var assert = require('assert'),
    pageUtil = require('../util/pageUtil');

function makeTextValue(word, x, y) {
    return {
        R: [
            {
                T: encodeURIComponent(word),
                }
            ],
        x: x,
        y: y
    };
}

function assertObject(a, b, value) {
    assert.equal(a, b, value + ' should be "' + a + '", but is "' + b + '"');
}

module.exports = {
    extractPageTest: function () {
        var grid = [];
        var word = 'First slot';
        var word2 = 'Second slot';
        var extractPage = pageUtil.extractPage(grid);

        extractPage(makeTextValue(word, 8, 0));

        assert.equal(grid.length, 1, 'Grid be 1');
        assert.equal(grid[0][0], word, 'The first element in array in grid should be ' + word);

        extractPage(makeTextValue(word, 8, 1));

        assert.equal(grid.length, 2, 'Grid be 1');
        assert.equal(grid[1][0], word, 'The second element in array in grid should be ' + word);
    },

    extractPageDobbelTest: function () {
        var grid = [];
        var texts = [
            '1.',
            '2.',
            '3.',
            '4.',
            '5.',
            '6.',
            '7.'
        ];

        var extractPage = pageUtil.extractPage(grid);

        extractPage(makeTextValue(texts[0], 10.02401375, 0));
        extractPage(makeTextValue(texts[1], 27.5144125, 0));
        extractPage(makeTextValue(texts[2], 50.01408750000001, 0));
        extractPage(makeTextValue(texts[3], 64.92867812500002, 0));
        extractPage(makeTextValue(texts[4], 73.93812500000001, 0));
        extractPage(makeTextValue(texts[5], 86.7470921875, 0));
        extractPage(makeTextValue(texts[6], 92.17095156250001, 0));

        assert.equal(grid[0][0], texts[0]);
        assert.equal(grid[0][1], texts[1]);
        assert.equal(grid[0][2], texts[2]);
        assert.equal(grid[0][3], texts[3]);
        assert.equal(grid[0][4], texts[4]);
        assert.equal(grid[0][5], texts[5]);
        assert.equal(grid[0][6], texts[6]);
    },

    categoriesTest: function () {
        var grid = [
            ['Sist endret 12.05.2014', '', ''],
            ['Helse Sør-Øst RHF, Kjøp av helsetjenester, tlf. 02411'],
            ['Navn', 'Praksisadr', 'Postadresse', 'Poststed', 'Tlf. praksis', 'Avtale', 'Kommentar'],
            ['Category: 1', '', ''],
            ['Cat 1 - Name 1',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            '20',
            'Kommentar'],
            ['Sist endret 12.05.2014'],
            ['Cat 1 - Name 2',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            '20',
            'Kommentar'],
            ['Category: 2', '', ''],
            ['Cat 2 - Name 1',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            '20',
            'Kommentar'],
            ['Cat 2 - Name 2',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            '20',
            'Kommentar'],
            ['Helse Sør-Øst RHF, Kjøp av helsetjenester, tlf. 02411'],
            ['Cat 2 - Name 3',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            '20',
            'Kommentar']
        ],
            categories = {
                'Category: 1': 'Category: 1',
                'Category: 2': 'Category: 2'
            };

        var data = pageUtil.extractData(grid, categories);

        //console.log(data);

        assert.equal(grid[0][0], data.lastUpdate);

        assert.notEqual(data['Category: 1'], undefined);
        assert.notEqual(data['Category: 2'], undefined);

        assertObject(grid[4][0], data['Category: 1'][0].name);
        assertObject(grid[6][0], data['Category: 1'][1].name);

        assertObject(grid[8][0], data['Category: 2'][0].name);
        assertObject(grid[9][0], data['Category: 2'][1].name);
        assertObject(grid[11][0], data['Category: 2'][2].name);
    },

    objectifyArrayTest: function () {
        var array = ['Holstad, Grete Johanne',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            '20',
            'Kommentar'];

        var object = pageUtil.objectifyArray(array);

        assertObject(array[0], object.name, 'Name');
        assertObject(array[1], object.workAdress, 'Work adress');
        assertObject(array[2], object.mailAdress, 'Mail adress');
        assertObject(array[3], object.mailPostal, 'Mail postal');
        assertObject(array[4], object.phone, 'Phone');
        assertObject(array[5], object.time, 'Time');
        assertObject(array[6], object.comment, 'Comment');

        var arrayUndefined = ['Holstad, Grete Johanne',
            'Terapeutene Majorstua',
            'Majorstuvn. 36',
            '0367 Oslo',
            '99256816',
            undefined,
            'Kommentar'];

        var object2 = pageUtil.objectifyArray(arrayUndefined);

        assertObject(arrayUndefined[0], object2.name, 'Name');
        assertObject(arrayUndefined[1], object2.workAdress, 'Work adress');
        assertObject(arrayUndefined[2], object2.mailAdress, 'Mail adress');
        assertObject(arrayUndefined[3], object2.mailPostal, 'Mail postal');
        assertObject(arrayUndefined[4], object2.phone, 'Phone');
        assertObject(object2.time, '', 'Time');
        assertObject(arrayUndefined[6], object2.comment, 'Comment');
    },

    phoneNumberTest: function () {
        var mobilPhone = '90010200',
            mobilPhone2 = '40010200',
            phone = '22102030',
            dobbelPhone = '22491197/ 88002627',
            toShort = '2491197';

        assert.equal('900 10 200', pageUtil.phoneNumber(mobilPhone));
        assert.equal('400 10 200', pageUtil.phoneNumber(mobilPhone2));
        assert.equal('22 10 20 30', pageUtil.phoneNumber(phone));
        assert.equal('22 49 11 97 / 88 00 26 27', pageUtil.phoneNumber(dobbelPhone));
        assert.equal('2491197 er for kort', pageUtil.phoneNumber(toShort));
    }
};