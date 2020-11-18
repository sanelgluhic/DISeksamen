

















/*
const express = require('express');

const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const https = require('https');
const fs = require('fs');
const path = require('path');


const clientsRoute = require('../DISeksamen/API-filer/routes/clients');

app.use('/clients', clientsRoute);

// Oprettelse af forbindelse til egen database
mongoose.connect('mongodb+srv://sanelsen:sanelersej1@cluster0.l0tif.mongodb.net/test', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// Oprettelse af en server
var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};

var sslServer = https.createServer(credentials, app);

sslServer.listen(3443, () => {
    console.log('Server lytter på port: 3443');
});



/*
app.use(bodyParser.json());
 */

/*
const accountRoute = require('./API-filer/routes/accounts');
const clientRoute = require('./API-filer/routes/clients');


app.use('/clients', clientRoute);
app.use('/accounts', accountRoute);

 */

/*
//Error handling:
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

 */

//module.exports = app;
// module.exports = router;
