const videoMaker = require("../video-maker/index");

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
}

module.exports = Video;