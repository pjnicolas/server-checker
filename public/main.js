var sensorsLoaded = false;
var cfgLoaded = false;

var showContent = () => {
  if (sensorsLoaded && cfgLoaded) {
    document.getElementById('content').hidden = false;
  }
};

function handleCheckedStatic(checked) {
  var trAddress = document.getElementById('tr-ip-address');
  var trSubnetMask = document.getElementById('tr-ip-subnetMask');
  var trGateway = document.getElementById('tr-ip-gateway');

  var address = document.getElementById('ip-address');
  var subnetMask = document.getElementById('ip-subnetMask');
  var gateway = document.getElementById('ip-gateway');

  if (checked) {
    trAddress.classList.remove('disabled');
    trSubnetMask.classList.remove('disabled');
    trGateway.classList.remove('disabled');

    address.disabled = false;
    subnetMask.disabled = false;
    gateway.disabled = false;
  } else {
    trAddress.classList.add('disabled');
    trSubnetMask.classList.add('disabled');
    trGateway.classList.add('disabled');

    address.disabled = true;
    subnetMask.disabled = true;
    gateway.disabled = true;

    address.value = '';
    subnetMask.value = '';
    gateway.value = '';
  }
}

function checkCheckedStatic() {
  handleCheckedStatic(this.checked);
}

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
    document.getElementById('temperature-ok').value = data.temperature.ok;
    document.getElementById('temperature-warning').value = data.temperature.warning;
    document.getElementById('temperature-danger').value = data.temperature.danger;
    document.getElementById('sensor-lostTimeout').value = data.sensor.lostTimeout;

    document.getElementById('email-sender').value = data.email.sender;
    document.getElementById('email-password').value = data.email.password;
    document.getElementById('email-provider').value = data.email.provider;
    document.getElementById('email-port').value = data.email.port;
    document.getElementById('email-secure').checked = data.email.secure;
    // document.getElementById('email-receiver').value = data.email.receiver;

    document.getElementById('ip-static').checked = data.ip.static;
    document.getElementById('ip-address').value = data.ip.address;
    document.getElementById('ip-subnetMask').value = data.ip.subnetMask;
    document.getElementById('ip-gateway').value = data.ip.gateway;

    handleCheckedStatic(data.ip.static);

    cfgLoaded = true;.
    showContent();
  }).catch(error => {
    console.error(error);
  });

document.getElementById('ip-static').addEventListener('click', checkCheckedStatic);

const checkValidIp = ip => {
  const ipSplit = ip.split('.');
  if (ipSplit.length !== 4) {
    return false;
  }

  for (const chunk of ipSplit) {
    // Prevent stuff like spaces ("  192")
    if (chunk.match(/^\d*$/g) === null) {
      return false;
    }

    const n = Number(chunk);
    if ((!Number.isInteger(n)) || (Number > 255) || (Number < 0)) {
      return false;
    }
  }

  return true;
}