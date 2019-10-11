const express = require("express");
const md5 = require("md5");

const Cliente = require("./Model/cliente");
const Video = require("./Model/video");

const app = express();
app.use(express.json());

app.post('/api/create-user', (req, res) => {
    let conta = new Cliente(req, res);
    conta.createNewUser(
        req.body.username, 
        req.body.password, 
        req.body.birthday, 
        req.body.name, 
        req.body.email
    );
});

app.post('/api/login', (req, res) => {
    let conta = new Cliente(req, res);
    conta.login(
        req.body.email,
        req.body.password
    );
});

app.post('/api/create-video', (req, res) => {
    let video = new Video(req, res);
    video.createNewVideo();
    /*
    {
	"prefix": "About",
	"searchTerm": "Dell",
	"quantitySentences": "7",
	"voice": "paid",
	"language": "EN"
    }
    */
});

app.get('/api/videos-created-by-user', (req, res) => {
    let video = new Video(req, res);
    video.getVideosFrom(req.body.userId);
})

app.get('/oauth2callback', (req, res) => {
    const authCode = req.query.code;
    console.log(`> [youtube-robot] Consent given: ${authCode}`);

    res.send('<h1>Thank you!</h1><p>Now close this tab.</p>');
    resolve(authCode)
})


app.listen(3001);