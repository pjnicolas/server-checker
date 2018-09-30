import Adafruit_DHT
import requests
from time import sleep

req_url = 'http://localhost:7777/'
req_headers= {'content-type': 'application/json'}
sensor = Adafruit_DHT.DHT22
pin = 4
delay_time = 5

def createRequestData(temperature, humidity, electricalOutlet):
    json = '''{{ "temperature": {}, "humidity": {}, "electricalOutlet": {} }}'''
    return json.format(temperature, humidity, electricalOutlet)

def sendData(temperature, humidity, electricalOutlet):
    data = createRequestData(temperature, humidity, electricalOutlet)
    print(data)
    try:
        # TODO Get the response status
        response = requests.post(req_url, data=data, headers=req_headers)
    except:
        print("Error connecting to TriggerServer")

def measureData():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    humidity = round(humidity, 2)
    temperature = round(temperature, 2)
    # TODO Get electricalOutlet
    electricalOutlet = "true"
    print(str(humidity) + " %,  " + str(temperature) + " C")
    sendData(temperature, humidity, electricalOutlet)

while True:
    measureData()
    sleep(delay_time)
