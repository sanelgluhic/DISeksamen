var http = require('https');
var httpProxy = require('http-proxy');
var seaport = require('seaport');
var seaportConnect = seaport.connect('localhost', 9090);

const path = require('path');
const fs = require('fs');

var i = -1;
var proxy = new httpProxy.createProxyServer({}); // skal dette ændres?

var server = http.createServer({key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))},function(req, res) { // skal dette ændres?
    addresses = seaportConnect.query('httpsServer', 'httpsServer1');
    if (!addresses.length) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service unavailable');
        return;
    }
    i = (i + 1) % addresses.length;
    var host = addresses[i].host.split(":").reverse()[0];
    var port = addresses[i].port;
    proxy.web(req, res, { target: 'https://' + host + ':' + port , secure:false});
});

server.listen(3443, function () {
    console.log('load balancer listening on port 3443');
});




/*
var https = require('https');
var httpsProxy = require('https-proxy');
var seaport = require('seaport');
var seaportConnect = seaport.connect('localhost', 3443);
var app = express();

var proxy = new httpsProxy.createProxyServer({});
var i = - 1;
var addresses = [];

var credentials = {key: fs.readFileSync(path.join(__dirname, 'cerKey', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cerKey', 'cert.pem'))};

var sslServer = https.createServer(function (req, res) {
    addresses = seaportConnect.query("server", "server1","server2" );
    if (addresses.length == 0) {
        res.end("Connection closed");
    }
    i = (i + 1) % addresses.length; // hver gang der kommer et request ind, bliver det sendt til forskellige server ligelidt.
    var host = addresses[i].host.split(":").reverse()[0];
    var port = addresses[i].port;
    proxy.web(req, res, { target: 'https://' + host + ':' + port });
});


server.listen(8080, function () {
    console.log("loadbalance is listening");
});





var sslServer = https.createServer(credentials, app);

sslServer.listen(3443, () => {
    console.log('Server listening on 3443');
});
 */