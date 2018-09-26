/* eslint-disable no-var */
/* global window document fetch */

var sensorsLoaded = false;
var cfgLoaded = false;

function showContent() {
  if (sensorsLoaded && cfgLoaded) {
    document.getElementById('content').hidden = false;
  }
}

function receiversToString(receivers) {
  return receivers.map(({email, subject}) => [email, subject].join(':')).join(';');
}

function parseReceivers(receivers) {
  var tmp = receivers.split(';').map(e => e.trim().split(':').map(x => x.trim()));
  return tmp.map(e => ({
    email: e[0],
    subject: e[1],
  }));
}

fetch(`http://${window.location.hostname}:3000/sensors`)
  .then(data => data.json())
  .then(data => {
    const {temperature, humidity, electricalOutlet} = data;
    document.getElementById('temperature').innerHTML = temperature;
    document.getElementById('humidity').innerHTML = humidity;
    document.getElementById('electricalOutlet').innerHTML = electricalOutlet;
    sensorsLoaded = true;
    showContent();
  }).catch(error => {
    console.error(error);
  });

fetch(`http://${window.location.hostname}:3000/cfg`)
  .then(data => data.json())
  .then(data => {
    document.getElementById('temperature-ok').value = data.temperature.ok;
    document.getElementById('temperature-warning').value = data.temperature.warning;
    document.getElementById('temperature-danger').value = data.temperature.danger;
    document.getElementById('sensor-lostTimeout').value = data.sensor.lostTimeout;
    document.getElementById('email-provider').value = data.email.provider;
    document.getElementById('email-port').value = data.email.port;
    document.getElementById('email-secure').value = data.email.secure;
    document.getElementById('email-sender').value = data.email.sender;
    document.getElementById('email-password').value = '';
    document.getElementById('email-receivers').value = receiversToString(data.email.receivers);

    cfgLoaded = true;
    showContent();
  }).catch(error => {
    console.error(error);
  });

function validateForm() {
  var receivers = document.forms.mainForm['email-receivers'].value;
  receivers = parseReceivers(receivers);

  for (var i = 0; i < receivers.length; i += 1) {
    const r = receivers[i];
    // TODO: Email regex
    if (r.subject === undefined || r.email === undefined || r.email === "") {
      alert('Invalid field "Email receivers". Please, check it and follow the pattern "peter@smith.com:subject; john@snow:subject2; duck@donald:subject3"');
      return false;
    }
  }

  return true;
}