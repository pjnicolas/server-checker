/* eslint-disable no-var */
/* global window document fetch */

var sensorsLoaded = false;
var cfgLoaded = false;

var showContent = () => {
  if (sensorsLoaded && cfgLoaded) {
    document.getElementById('content').hidden = false;
  }
};

fetch(`http://${window.location.hostname}:3000/sensors`)
  .then(data => data.json())
  .then(data => {
    const {temperature, humidity} = data;
    document.getElementById('temperature').innerHTML = temperature;
    document.getElementById('humidity').innerHTML = humidity;
    sensorsLoaded = true;
    showContent();
  }).catch(error => {
    console.error(error);
  });

fetch(`http://${window.location.hostname}:3000/cfg`)
  .then(data => data.json())
  .then(data => {
    document.getElementById('temperature-warning').value = data.temperature.warning;
    document.getElementById('temperature-danger').value = data.temperature.danger;
    document.getElementById('temperature-frozen').value = data.temperature.frozen;
    document.getElementById('temperature-coolDownTime').value = data.temperature.coolDownTime;
    document.getElementById('sensor-lostTimeout').value = data.sensor.lostTimeout;
    document.getElementById('email-sender').value = data.email.sender;
    document.getElementById('email-password').value = '';
    // TODO: document.getElementById('email-receiver').value =
    cfgLoaded = true;
    showContent();
  }).catch(error => {
    console.error(error);
  });
