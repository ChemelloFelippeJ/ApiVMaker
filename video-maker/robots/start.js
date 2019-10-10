const rimraf = require("rimraf");
const fs = require("fs");

async function robot(id) {
    if(!fs.existsSync(`./video-maker/contents/${id}`)){
        fs.mkdirSync(`./video-maker/contents/${id}`);
        console.log(`> [start-robot] Directory ${id} created`);
    }else{
        console.log(`> [start-robot] Directory ${id} already exists`);
    }
    
}

module.exports = robot;