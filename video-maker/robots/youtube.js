const express = require('express');
const google = require('googleapis').google;
const youtube = google.youtube({version: 'v3'});
const OAuth2 = google.auth.OAuth2;
const state = require('./state.js');
const fs = require('fs');
const apiVideo = require('@api.video/nodejs-sdk');
const fbUpload = require('facebook-api-video-upload');
const mysql = require("mysql");
var db = mysql.createConnection({
    "host": "mysql.lightcode.dev",
    "user": "lightcode",
    "password": "fc251199",
    "database": "lightcode"
})

async function robot(id) {
    console.log('> [youtube-robot] Starting...');
    const content = state.load(id);

    const videoFilePath = `./video-maker/contents/${id}/video.mp4`;
    const videoFileSize = fs.statSync(videoFilePath).size;

    let videoTitle = `${content.prefix} ${content.searchTerm}`;
    console.log(`> [youtube-robot] Video title set`);

    let videoDescription = await returnVideoDescription(content);
    console.log(`> [youtube-robot] Video description set`);

    let videoTags = [content.searchTerm, ...content.sentences[0].keywords, ...content.sentences[1].keywords, ...content.sentences[2].keywords];
    console.log(`> [youtube-robot] Video tags set`);

    uploadApiVideo();

    function uploadApiVideo(){
        // Create client for Sandbox and authenticate
        const client = new apiVideo.ClientSandbox({ apiKey: 'ueyfKkS7UnUFQOfxxQDZdUVbXHzgzTjvZe6oLD3rQZf' });

        // Create and upload a video ressource
        let result = client.videos.upload(`./video-maker/contents/${id}/video.mp4`, {title: videoTitle});
        
        result.then(function(video) {
            db.query(`
                INSERT INTO user_content_video(idAccount, idContent, url)
                VALUES('${0}', '${id}', '${video.assets.player}')
            `)
        }).catch(function(error) {
            console.error(error);
        });
    
    }

    async function returnVideoDescription(content){
        let videoDescription = "";
        for(let index = 0; index < content.maximumSentences; index++) {
            videoDescription = videoDescription + content.sentences[index].text + "\n\n";
        }
        videoDescription = `${videoDescription} #${content.searchTerm}`;
        return videoDescription;
    }



}

module.exports = robot;
