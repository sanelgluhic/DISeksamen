const express = require('express');
const mongoose = require('mongoose');
const nodemon = require('nodemon');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');
var app = express();

// Connect til DB
mongoose.connect('mongodb://localhost:27017/bankingExam', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//Added Json Body-parser
app.use(bodyParser.json());

const clientsRoute = require('./API-filer/routes/clients');
app.use('/clients', clientsRoute);

var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};

app.get('/:name/:lastname/:adress', function(req,res){
    res.send(req.params.name + ' ' + req.params.lastname + ' ' + req.params.adress);
});


var sslServer = https.createServer(credentials, app);

sslServer.listen(3443, () => {
    console.log('Server listening on 3443');
});

