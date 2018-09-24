const fs = require('fs');
const express = require('express');

const config = require('../cfg.json');
const {sendMail} = require('./mail');
const template = require('./mail-template');
const type = require('./type');

const triggerPort = config.net.port.trigger;
const temperatureOk = config.temperature.ok;
const temperatureWarning = config.temperature.warning;
const temperatureDanger = config.temperature.danger;
const sensorLostTimeout = config.sensor.lostTimeout;

const app = express();

const SensorState = {
  CONNECTED: 1,         // The program is receiving data from sensors.
  CONNECTION_LOST: 2,   // The program didn't receive dara from sensors for a long time.
};

const TemperatureState = {
  OK: 1,                // The temperature is OK.
  WARNING: 2,           // The temperature is above the WARNING level.
  DANGER: 3,            // The temperature is above the DANGER level.
};

let temperatureState = TemperatureState.OK;
let sensorState = SensorState.CONNECTED;

// This holds a timeout id. The timeout should be reseted every time the sensor sends some data. If
// the timeout is not reseted for a long time, the connection state should be marked as lost.
let sensorDataTimeout;

// This function is useful for resetting the `sensorDataTimeout` timeout. Call it every time the
// sensor sends any data.
const sensorSignal = () => {
  if (sensorState === SensorState.CONNECTION_LOST) {
    sendMail(template.connection.ok);
  }
  sensorState = SensorState.CONNECTED;
  clearInterval(sensorDataTimeout);
  sensorDataTimeout = setTimeout(() => {
    sensorState = SensorState.CONNECTION_LOST;
    sendMail(template.connection.lost);
  }, sensorLostTimeout);
};

const saveSensorData = (temperature, humidity, electricalOutlet) => {
  const date = new Date();
  const data = JSON.stringify({date, temperature, humidity, electricalOutlet});
  fs.writeFileSync('./sensor-data.json', data);
  fs.appendFileSync('./sensor-data.log', data);
};

app.get('/', (req, res) => {
  const {temperature, humidity, electricalOutlet} = req.query; // TODO: Change this to a POST json
  if (!type.number(temperature)) {
    res.sendStatus(400);
    throw new TypeError('The "temperature" must be a number');
  }

  if (!type.boolean(electricalOutlet)) {
    res.sendStatus(400);
    throw new TypeError('The "electricalOutlet" must be a number');
  }

  if (!type.number(humidity)) {
    res.sendStatus(400);
    throw new TypeError('The "humidity" must be a number');
  }

  sensorSignal();

  saveSensorData(temperature, humidity, electricalOutlet);

  switch (temperatureState) {
    case TemperatureState.OK:
      if (temperature > temperatureDanger) {
        temperatureState = TemperatureState.DANGER;
        sendMail(template.temperature.danger);
      } else if (temperature > temperatureWarning) {
        temperatureState = TemperatureState.WARNING;
        sendMail(template.temperature.warning);
      }
      break;
    case TemperatureState.WARNING:
      if (temperature > temperatureDanger) {
        temperatureState = TemperatureState.DANGER;
        sendMail(template.temperature.danger);
      } else if (temperature < temperatureOk) {
        temperatureState = TemperatureState.OK;
        sendMail(template.temperature.restored);
      }
      break;
    case TemperatureState.DANGER:
      if (temperature < temperatureOk) {
        temperatureState = TemperatureState.OK;
        sendMail(template.temperature.restored);
      }
      break;
    default:
      throw new Error('Unknown temperature state');
  }

  res.sendStatus(200);
});

app.listen(triggerPort, () => {
  console.log(`TriggerServer listening on port ${triggerPort}`);
});
