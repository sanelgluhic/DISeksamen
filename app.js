// Her requires noget forskelligt
const express = require('express');
const mongoose = require('mongoose');
const nodemon = require('nodemon');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');
var app = express();

// Variabel gemmes bestående af et objekt. Det er fra denne seaport instans, hvor jeres servere registreres.
var seaport = require('seaport');
var ports = seaport.connect('localhost', 9090);

// Forbindelse til MongoDB
mongoose.connect('mongodb://localhost:27017/bankingExam', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//JSON parser tilføjes
app.use(bodyParser.json());

// Ruter impoteres
const clientsRoute = require('./API-filer/routes/clients');
app.use('/clients', clientsRoute);
const accountsRoute = require('./API-filer/routes/accounts');
app.use('/accounts', accountsRoute);

/* key-property (private key) og cert-property (certifikat) gemmes i en variabel.
Credentials bruges til at fortælle systemet hvorfra den skal læse certifikatet og private key */
var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};


// Oprettelse af server
var httpsServer = https.createServer(credentials, app);


/* Får server til at lytte igennem en seaport instans efter eventuelle request
her kan man i princippet kører flere app.js filer, for at intialisere flere severe */
httpsServer.listen(ports.register('httpsServer'), function () {
    console.log('Server listening on %d', this.address().port);
});
