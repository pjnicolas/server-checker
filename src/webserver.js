const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../.rpitriggercfg.json');

const webserverPort = config.net.port.webserver;

const app = express();

const CONFIG_FILE = './.rpitriggercfg.json';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/set', (req, res) => {
  const {body} = req;

  const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE));
  cfg.sensor.lostTimeout = body['sensor-lostTimeout'];
  cfg.temperature.warning = body['temperature-warning'];
  cfg.temperature.danger = body['temperature-danger'];
  cfg.temperature.frozen = body['temperature-frozen'];
  cfg.temperature.coolDownTime = body['temperature-coolDownTime'];
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg));

  res.redirect('/');
});

app.get('/cfg', (req, res) => {
  const cfg = fs.readFileSync(CONFIG_FILE);
  res.send(cfg);
});

app.get('/factory-reset', (req, res) => {
  res.redirect('/');
});

app.get('/sensors', (req, res) => {
  const sensorData = fs.readFileSync('./sensor-data.json');
  res.send(sensorData);
});

app.listen(webserverPort, () => {
  console.log(`WebServer listening on port ${webserverPort}`);
});
