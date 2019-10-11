const videoMaker = require("../video-maker/index");
const mysql = require("mysql");
var db = mysql.createConnection({
    "host": "mysql.lightcode.dev",
    "user": "lightcode",
    "password": "fc251199",
    "database": "lightcode"
})

class Video {
    constructor(req, res, searchTerm, lang, voice, qtdSentences, prefix){
        this.req = req;
        this.res = res;
        this.videoURL;
        this.content;
        this.language = lang;
        this.voice = voice;
        this.qtdSentences = qtdSentences;
        this.searchTerm = searchTerm;
        this.prefix = prefix;
        this.imagesURL;
    }   

    createNewVideo(){
        let vm = new videoMaker(this.req, this.res);
        vm.create(vm);
    }

    getVideosFrom(userId) {
        db.query(`
            SELECT 
                url
            FROM user_content_video
            WHERE idAccount = '${userId}';
        `).on('error', (err) => {
            this.res.send(err);
        }).on('result', (result) => {
            this.res.send(result);
        })
    }
}

module.exports = Video;