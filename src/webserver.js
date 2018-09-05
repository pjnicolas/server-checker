const express = require('express');

const config = require('../.rpitriggercfg.json');
const WEBSERVER_PORT = config.net.port.webserver;

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

app.listen(WEBSERVER_PORT, () => {
  console.log(`WebServer listening on port ${WEBSERVER_PORT}`);
});
