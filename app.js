const express = require('express');
const mongoose = require('mongoose');
const nodemon = require('nodemon');
const bodyParser = require('body-parser');
const https = require('https');
var seaport = require('seaport');
var ports = seaport.connect('localhost', 9090);

const path = require('path');
const fs = require('fs');
var app = express();


// Forbindelse til DB
mongoose.connect('mongodb://localhost:27017/bankingExam', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//Json Body-parser
app.use(bodyParser.json());

const clientsRoute = require('./API-filer/routes/clients');
app.use('/clients', clientsRoute);

const accountsRoute = require('./API-filer/routes/accounts');
app.use('/accounts', accountsRoute);


var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};

app.get('/:name/:lastname/:adress', function(req,res){
    res.send(req.params.name + ' ' + req.params.lastname + ' ' + req.params.adress);
});

// Oprettelse af server
var httpsServer = https.createServer(credentials, app);

var httpsServer1 = https.createServer(credentials, app);

// Srver lytter på forskellige porte. Selve serveren kaldes det samme som i load balancer filen
httpsServer.listen(ports.register('httpsServer', 'httpsServer1'), function () {
    console.log('Server listening on %d', this.address().port);
});



/*

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

const accountsRoute = require('./API-filer/routes/accounts');
app.use('/accounts', accountsRoute);


var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};

app.get('/:name/:lastname/:adress', function(req,res){
    res.send(req.params.name + ' ' + req.params.lastname + ' ' + req.params.adress);
});

/*
var sslServer = https.createServer(credentials, app);

sslServer.listen(3443, () => {
    console.log('Server listening on 3443');
});

 */


