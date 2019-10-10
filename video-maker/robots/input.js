const state = require('./state.js');
const mysql = require("mysql");
var db = mysql.createConnection({
    "host": "mysql.lightcode.dev",
    "user": "lightcode",
    "password": "fc251199",
    "database": "lightcode"
})

async function robot(res, language, voice, searchTerm, prefix, qttSentences, time, objVMaker) {

    let content = {};

    content.language = language;
    content.voice = voice;
    content.searchTerm = searchTerm;
    content.prefix = prefix;
    content.maximumSentences = qttSentences;
    content.videoDestination = 'YouTube';

    db.query(`
        INSERT INTO Content(
            prefix,
            searchTerm,
            language,
            voice,
            qtdSentences,
            videoDestination,
            data,
            jsonContent
        ) VALUES (
            '${prefix}',
            '${searchTerm}',
            '${language}',
            '${voice}',
            '${qttSentences}',
            'YouTube',
            '${time}',
            '${JSON.stringify(content)}'
        )`)
        .on('error', (err) => {
            console.log(err);
            res.send(err);
        }).on('result', (result) => {
            content.id = result.insertId;
            objVMaker.id = content.id;  
            state.save(content, content.id);
        })
}

module.exports = robot;