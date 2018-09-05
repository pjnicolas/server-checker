const express = require('express');

const config = require('../.rpitriggercfg.json');
const webserverPort = config.net.port.webserver;

const app = express();

app.use(express.static('public'));


app.get('/set', (req, res) => {
  res.redirect('/');
});

app.set('/factory-reset', (req, res) => {
  res.redirect('/');
});

app.get('/logs', (req, res) => {

});

app.listen(webserverPort, () => {
  console.log(`WebServer listening on port ${webserverPort}`);
});
