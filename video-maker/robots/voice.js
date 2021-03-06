const googleTTS = require('google-tts-api');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const download = require('download-file')
const audioconcat = require('audioconcat')
const ffmpeg = require('fluent-ffmpeg');

const state = require('./state.js');

async function robot(id) {
    //Authenticates GoogleTTS
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "./video-maker/credentials/google-tts.json";

    console.log('> [voice-robot] Starting...');
    const content = state.load(id);

    let voices = [];
    let sentenceLenght;
    let languageFree;
    let languagePaid;
    let prefixLanguagePaid;

    if(content.voice === "Paga" || content.voice === "Paid"){
        sentenceLenght = 0;
    }else{
        sentenceLenght = 200;
    }

    if(content.language === "PT"){
        languageFree = "pt";
        prefixLanguagePaid = "pt-BR";
        prefixLanguagePaid = "pt-BR";
        languagePaid = "pt-BR-Wavenet-A";
    } else if (content.language === "EN"){
        languageFree = "en";
        prefixLanguagePaid = "en-US";
        languagePaid = "en-US-Wavenet-C";
    }

    for (let sentenceIndex = 0; sentenceIndex < content.maximumSentences; sentenceIndex++) {

        console.log(`> [voice-robot] Sentence ${sentenceIndex}`);
        let text = content.sentences[sentenceIndex].text;

        if (text.length < sentenceLenght) {
            await freeGoogleTTS(text, sentenceIndex);
        } else {
            await paidGoogleTTS(text, sentenceIndex);
        }

    }

    let i = 0;
    voices.push("./video-maker/contents/IntroAudioMute.mp3");
    do{
        if(fs.existsSync(`./video-maker/contents/${id}/output[${i}].mp3`)){
            voices.push(`./video-maker/contents/${id}/output[${i}].mp3`);
            console.log(`> [voice-robot] output[${i}].mp3 confirmed`);
            i++;
        }else{
            console.error(`> [voice-robot] output[${i}].mp3 doesn't exist`);
            await sleep(1000);
        }
    }while (i < content.maximumSentences);

    await voicesConcat();

    async function voicesConcat() {
        // ffmpeg()
        //     .input(`./video-maker/contents/${id}/output[0].mp3`)
        //     .input(`./video-maker/contents/${id}/output[1].mp3`)
        //     .input(`./video-maker/contents/${id}/output[2].mp3`)
        //     .input(`./video-maker/contents/${id}/output[3].mp3`)
        //     .input(`./video-maker/contents/${id}/output[4].mp3`)
        //     .input(`./video-maker/contents/${id}/output[5].mp3`)
        //     .input(`./video-maker/contents/${id}/output[6].mp3`)
        //     .mergeToFile(`./video-maker/contents/${id}/output[final].mp3`)
        //     .on('end', function() {
        //         console.log('Screenshots taken');
        //       })

        voices
            .reduce((prev, curr) => prev.input(curr), ffmpeg())
            .on("error", err => console.log(`> [voice-robot] ERROR: ${err.message}`))
            .on("end", () => {
                console.log(`> [voice-robot] Final audio transcript merged`);
            })
            .mergeToFile(`./video-maker/contents/${id}/output[final].mp3`);
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function freeGoogleTTS(text, sentenceIndex) {
        console.log('> [voice-robot] Free request');

        let options = {
            directory: ".",
            filename: "./video-maker/contents/${id}/output[" + sentenceIndex + "].mp3"
        };

        await googleTTS(text, languageFree, 1).then(async function (url) {
            await download(url, options, function(err){
                if (err) {
                    console.log(`> [voice-robot] Sentence ${sentenceIndex} download error `);
                }else{
                    console.log(`> [voice-robot] output[${sentenceIndex}].mp3 successful download `);
                }
            });
        });
    }

    async function paidGoogleTTS(text, sentenceIndex) {

        console.log('> [voice-robot] Paid request');

        const client = new textToSpeech.TextToSpeechClient();

        const request = {
            input: {text: text},
            voice: {
                languageCode: prefixLanguagePaid,
                name: languagePaid
            },
            audioConfig: {audioEncoding: 'MP3'}
        };

        await client.synthesizeSpeech(request, async (err, response) => {
            if (err) {
                console.log(`> [voice-robot] Sentence ${sentenceIndex} synthesize error - ${err}`);
            }else{
                console.log(`> [voice-robot] Sentence ${sentenceIndex} synthesize complete`);
            }

            await fs.writeFile(`./video-maker/contents/${id}/output[${sentenceIndex}].mp3`, response.audioContent, 'binary', err => {
                if (err) {
                    console.log(`> [voice-robot] Sentence ${sentenceIndex} error - ${err}`)
                } else{
                    console.log(`> [voice-robot] output[${sentenceIndex}].mp3 successful download `);
                }
            });
        });
    }

}


module.exports = robot

