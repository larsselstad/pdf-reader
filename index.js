/*jshint node: true*/

var fs = require('fs'),
    PDFParser = require("pdf2json/pdfparser"),
    pageUtil = require('./util/pageUtil'),
    htmlMaker = require('./util/html/htmlMaker');

var pathToPdf = __dirname + "/Psykologer_Oslo_telefonliste.pdf";

var pdfParser = new PDFParser();


// denne bør bare returnere grid
// løses med ett async/promise biblotek
pdfParser.on("pdfParser_dataReady", function (pdfData) {
    var grid = [];

    pdfData.data.Pages.forEach(function (page) {
        page.Texts.forEach(pageUtil.extractPage(grid));
    });

    // TODO: maser grid
    var a = {
        sistOppdater: '12.06.2014',
        psykologoer: [{
            name: 'masert navn',
            adress: 'masert praksis adresse',
            postAdress: 'masert post adresse',
            phone: 'masert mobil/fasttelefon',
            avtale: 100,
            kommentar: 'skal dette brukes?'
        }],
        nevrologer: ['samme som psykolog']
    };

    var pagesData = pageUtil.extractData(grid, {
        'Psykologer:': 'Psykologer:',
        'Nevropsykologer:': 'Nevropsykologer:'
    });

    //console.log(pagesData);

    htmlMaker(pagesData['Psykologer:'], pagesData['Nevropsykologer:']);
});

pdfParser.on("pdfParser_dataError", function (data) {
    console.log('error!');
});

fs.readFile(pathToPdf, function (err, pdfBuffer) {
    if (!err) {
        pdfParser.parseBuffer(pdfBuffer);
    }
});