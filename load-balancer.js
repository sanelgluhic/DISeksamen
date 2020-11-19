// Her requires noget forskelligt
var https = require('https');
var httpProxy = require('http-proxy');
const path = require('path');
const fs = require('fs');

// Variabel gemmes bestående af et objekt. Det er fra denne seaport instans, hvor server(ne) registreres.
var seaport = require('seaport');
var seaportConnect = seaport.connect('localhost', 9090);

/* key-property (private key) og cert-property (certifikat) gemmes i en variabel.
Credentials bruges til at fortælle systemet hvorfra den skal læse certifikatet og private key */
var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};

// Oprettelse af en proxy server som muliggøre at videresende request til et mål som er selvdefineret.
var proxy = new httpProxy.createProxyServer({}); // skal dette ændres?

var i = -1;


var server = https.createServer(credentials,function(req, res) {
    /* seaportConnect.query søger igennem alle registerede servere (jo flere åbne app.js filer, jo flere servere).
	Dette gemmes som et array, hvis array er tom = ingen servere ledige */
    addresses = seaportConnect.query('httpsServer', 'httpsServer1');
    if (!addresses.length) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service unavailable');
        return;
    }
    // Proxy itererer igennem vores array hver gang den får en request
    i = (i + 1) % addresses.length;
    var host = addresses[i].host.split(":").reverse()[0];
    var port = addresses[i].port;
    //Brug af vores proxy-instans til at kalde proxy.web og sende  request videre til målet
    proxy.web(req, res, { target: 'https://' + host + ':' + port , secure:false});
    console.log("Loadbalancer tildeler den indkommende request, til følgende server på port: " + port)
});

// Loadbalancer lytter på port 3443
server.listen(3443, function () {
    console.log('load balancer listening on port 3443');
});

