const fetch = require('node-fetch');
const config = require('../cfg.json');

const sendData = (temperature, humidity, electricalOutlet) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({temperature, humidity, electricalOutlet}),
  };

  fetch(`http://localhost:${config.net.port.trigger}/`, fetchOptions)
    .then(data => {
      // console.log(data);
    }).catch(error => {
      console.error(error);
    });
}

const logs = [
  {t: 20, e: true},
  {t: 25, e: true},
  {t: 28.5, e: true}, // Send warning
  {t: 29, e: true},
  {t: 26, e: true},
  {t: 24, e: true}, // Send ok
  {t: 24.5, e: true},
  {t: 27, e: true},
  {t: 34, e: true}, // Send warning
  {t: 37, e: true},
  {t: 41, e: true}, // Send danger
  {t: 42, e: true},
  {t: 34, e: true},
  {t: 27, e: true},
  {t: 20, e: true}, // Send ok
  {t: 27, e: true},
  {t: 47, e: true}, // Send warning
  {t: 20, e: true}, // Send ok
];

let i = 0;

setInterval(() => {
  if (i < logs.length) {
    const l = logs[i];
    sendData(l.t, 70, l.e);
    i += 1;
  }
}, 2500);