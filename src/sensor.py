import Adafruit_DHT
import requests
from time import sleep

req_url = 'http://localhost:7777/'
sensor = Adafruit_DHT.DHT22
pin = 4

def createRequestData(temperature, humidity, electricalOutlet):
    json = '''{{ "temperature": {}, "humidity": {}, "electricalOutlet": {} }}'''
    return json.format(temperature, humidity, electricalOutlet)

def sendData(temperature, humidity, electricalOutlet):
    data = createRequestData(temperature, humidity, electricalOutlet)
    response = requests.post(req_url, data=data)
    # TODO Get the response status

def measureData():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    # TODO Get electricalOutlet
    print(humidity, temperature)
    sendData(temperature, humidity, electricalOutlet)

while True:
    measureData()
    sleep(10)
