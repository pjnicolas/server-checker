import sys
import Adafruit_DHT
import requests

humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

temperature = round(temperature, 1)
humidity = round(humidity, 1)

# Sometimes you won't get a reading and the results will be null
if humidity is not None and temperature is not None:
    print('Temp={0:0.1f}ºC  Humidity={1:0.1f}%'.format(temperature, humidity))
else:
    print('Failed to get reading. Try again!')
    sys.exit(1)





task = {
    'hola': 3,
    'adios': 'mundo',
}

resp = requests.post('http://localhost:7777/', json=task)