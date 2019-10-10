const express = require("express");
const md5 = require("md5");
const Cliente = require("./Model/cliente");

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

app.listen(3001);