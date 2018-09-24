const fs = require('fs');
const express = require('express');

const config = require('../cfg.json');
const {sendMail} = require('./mail');
const template = require('./mail-template');

const triggerPort = config.net.port.trigger;
const temperatureOk = config.temperature.ok;
const temperatureWarning = config.temperature.warning;
const temperatureDanger = config.temperature.danger;
const sensorLostTimeout = config.sensor.lostTimeout;

const app = express();

// This holds a timeout id. The timeout should be reseted every time the sensor sends some data. If
// the timeout is not reseted for a long time, the connection state should be marked as lost.
let sensorDataTimeout;

// This function is useful for resetting the `sensorDataTimeout` timeout. Call it every time the
// sensor sends any data.
const sensorSignal = () => {
  if (currentSensorState === SensorState.CONNECTION_LOST) {
    sendMail(template.subject.ok, template.connection.ok);
  }
  currentSensorState = SensorState.CONNECTED;
  clearInterval(sensorDataTimeout);
  sensorDataTimeout = setTimeout(() => {
    currentSensorState = SensorState.CONNECTION_LOST;
    sendMail(template.subject.error, template.connection.lost);
  }, sensorLostTimeout);
}

const SensorState = {
  CONNECTED: 1,         // The program is receiving data from sensors.
  CONNECTION_LOST: 2,   // The program didn't receive dara from sensors for a long time.
};

const TemperatureState = {
  OK: 1,                // The temperature is OK.
  WARNING: 2,           // The temperature is above the WARNING level.
  DANGER: 3,            // The temperature is above the DANGER level.
};

let currentTemperatureState = TemperatureState.OK;
let currentSensorState = SensorState.CONNECTED;

const saveSensorData = (temperature, humidity, electricalOutlet) => {
  const date = new Date();
  const data = JSON.stringify({date, temperature, humidity, electricalOutlet});
  fs.writeFileSync('./sensor-data.json', data);
  fs.appendFileSync('./sensor-data-log.json', data);
};

app.get('/', (req, res) => {
  const {temperature, humidity, electricalOutlet} = req.query;
  if (typeof temperature !== 'number' || typeof electricalOutlet !== 'boolean') {
    throw new TypeError('The parameter "temperature" should be a number and "electricalOutlet" a boolean');
  }

  sensorSignal();

  saveSensorData(temperature, humidity, electricalOutlet);

  switch (currentTemperatureState) {
    case TemperatureState.OK:
      if (temperature > temperatureDanger) {
        currentTemperatureState = TemperatureState.DANGER;
        sendMail(template.subject.danger, template.temperature.danger);
      } else if (temperature > temperatureWarning) {
        currentTemperatureState = TemperatureState.WARNING;
        sendMail(template.subject.warning, template.temperature.warning);
      }
      break;
    case TemperatureState.WARNING:
      if (temperature > temperatureDanger) {
        currentTemperatureState = TemperatureState.DANGER;
        sendMail(template.subject.danger, template.temperature.danger);
      } else if (temperature < temperatureOk) {
        currentTemperatureState = TemperatureState.OK;
        sendMail(template.subject.ok, template.temperature.restored);
      }
      break;
      case TemperatureState.DANGER:
      if (temperature < temperatureOk) {
        currentTemperatureState = TemperatureState.OK;
        sendMail(template.subject.ok, template.temperature.restored);
      }
      break;
    default:
      throw new Error('Unknown temperature state');
  }
  res.send('');
});

app.listen(triggerPort, () => {
  console.log(`TriggerServer listening on port ${triggerPort}`);
});
