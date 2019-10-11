const md5 = require("md5");
const mysql = require("mysql");
var db = mysql.createConnection({
    "host": "mysql.lightcode.dev",
    "user": "lightcode",
    "password": "fc251199",
    "database": "lightcode"
})

class Cliente {
    constructor(req = null, res = null) {
        this.id = null;
        this.username = null;
        this.password = null;
        this.birthDate = null;
        this.name = null;
        this.email = null;
        this.youtubeToken = null;
        this.videoProAvaiable = null;
        this.res = res;
        this.req = req;
    }

    createNewUser(user, senha, birth, name, email){
        
        this.username = user;
        this.password = md5(senha);
        this.name = name;
        this.email = email;
        this.birthDate = new Date(birth);

        console.log( this.insertNewUserDb());
    }

    insertNewUserDb() {
        let response;
        db.query(
            `INSERT INTO Account(
                username,
                email,
                senha,
                nome, 
                aniversario
            ) VALUES (
                '${this.username}', 
                '${this.email}', 
                '${this.password}', 
                '${this.name}',
                '${this.birthDate}'
            )`
        ).on('error', (error) => {
            if(error.code == 'ER_DUP_ENTRY'){ 
                this.res.send("Usuário já existe");
            }else{
                this.res.send(error);
            }
        }).on('result', (result) => {
            this.res.send("Conta criada com sucesso");
        })
    }

    login(email, senha) {
        db.query(`SELECT IF(count(*) > 0, 'true', 'false') AS validateEmailPassword FROM Account WHERE email = '${email}' AND senha = '${md5(senha)}'`)
            .on('error', (error) => {
                this.res.send("Erro ao efetuar login" + error);
            })
            .on('result', (result) => {
                console.log(result.validateEmailPassword);
                if(result.validateEmailPassword === 'true') {
                    db.query(`SELECT * FROM Account WHERE email = '${email}' AND senha = '${md5(senha)}'`)
                        .on('error', (error) => {
                            this.res.send("Erro ao efetuar login" + error);
                        })
                        .on('result', (result) => {
                            this.id = result.id;
                            this.username = result.username;
                            this.birthDate = result.aniversario;
                            this.name = result.nome;
                            this.email = result.email;
                            this.youtubeToken = result.youtubeToken;
                            this.videoProAvaiable = result.qtdVideosProAvaiable;
                        })
                }else{ 
                    console.log("2");
                    this.res.send("E-mail ou senha incorreto");
                }
            }) 
    }

    async authenticateWithOAuth() {
        const OAuthClient = await createOAuthClient();
        requestUserConsent(OAuthClient);
        const authorizationToken = await waitForGoogleCallback(webServer);
        await requestGoogleForAccessTokens(OAuthClient, authorizationToken);
        await setGlobalGoogleAuthentication(OAuthClient);
        await stopWebServer(webServer);

        async function createOAuthClient() {
            const credentials = require('../credentials/google-youtube.json');

            const OAuthClient = new OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            );

            return OAuthClient
        }

        function requestUserConsent(OAuthClient) {
            const consentUrl = OAuthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/youtube']
            });

            console.log(`> [youtube-robot] Please give your consent: ${consentUrl}`)
        }

        async function requestGoogleForAccessTokens(OAuthClient, authorizationToken) {
            return new Promise((resolve, reject) => {
                OAuthClient.getToken(authorizationToken, (error, tokens) => {
                    if (error) {
                        return reject(error)
                    }

                    console.log('> [youtube-robot] Access tokens received!');

                    OAuthClient.setCredentials(tokens);
                    resolve()
                })
            })
        }

        function setGlobalGoogleAuthentication(OAuthClient) {
            google.options({
                auth: OAuthClient
            })
        }

        async function stopWebServer(webServer) {
            return new Promise((resolve, reject) => {
                webServer.server.close(() => {
                    resolve()
                })
            })
        }
    }


    
}

module.exports = Cliente;
