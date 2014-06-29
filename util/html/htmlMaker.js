/*jshint node: true*/
var fs = require('fs'),
    dot = require('dot'),
    page = fs.readFileSync('./site/template/page.template.html', 'utf8'),
    people = fs.readFileSync('./site/template/people.template.html', 'utf8');

var tableStart = '<table><tr><th>Navn</th><th>Praksisadr</th><th>Postadresse</th><th>Poststed</th><th>Tlf. praksis</th><th>Avtale</th><th>Kommentar</th></tr>';

function out(text) {
    return text || '&nbsp;';
}

module.exports = function (psykologer, nevropsykologer) {

    var html = fs.createWriteStream('./site/table.html');

    // TODO: Løs HTML generering med templates
    var peopleTempFn = dot.template(people);
    var pageTempFn = dot.template(page);

    var peopleRes1 = peopleTempFn({
        tittel: 'Psykologer',
        personer: psykologer
    });

    var peopleRes2 = peopleTempFn({
        tittel: 'Nevropsykologer',
        personer: nevropsykologer
    });

    var pageRes = pageTempFn({
        body: peopleRes1 + peopleRes2
    });

    html.end(pageRes);
};