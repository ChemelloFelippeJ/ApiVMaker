const robots = {
    input: require('./robots/input.js'),
    trends: require('./robots/trends'),
    text: require('./robots/text.js'),
    state: require('./robots/state.js'),
    image: require('./robots/image.js'),
    voice: require('./robots/voice'),
    video: require('./robots/video.js'),
    youtube: require('./robots/youtube.js')
};
const fs = require("fs");

// await robots.voice();
// await robots.video();
// await robots.youtube()

class VMaker {
    constructor(req, res) {
        this.res = res;
        this.language = req.body.language;
        this.voice = req.body.voice;
        this.qtdSentences = req.body.quantitySentences;
        this.searchTerm = req.body.searchTerm;
        this.prefix = req.body.prefix;
    }

    async create(obj) {
        this.time = new Date();
        // await robots.input(this.res, this.language, this.voice, this.searchTerm, this.prefix, this.qtdSentences, this.time, obj);
        // await this.sleep(500);
        // await robots.text(this.id);
        // await robots.image(this.id);
        this.id = 76;
        await robots.voice(this.id);
    }

    getLastDirName() {
        for(let i = 0; i >= 0; i++){ 
            if(!fs.existsSync(`./video-maker/contents/${i}`)){
                return i-1;
            }else{
                console.log(i);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = VMaker;
