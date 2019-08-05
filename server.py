from threading import Thread
from flask import Flask, render_template, jsonify
import serial  # pyserial

accel_values = [0, 0, 0]


def fetch_accel_values():
    dev_serial = serial.Serial('/dev/cu.usbmodem14131', 115_200)
    global accel_values
    while True:
        accel_values = [float(s) for s in dev_serial.readline().split()]


serial_fetch_thread = Thread(target=fetch_accel_values)
serial_fetch_thread.start()

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/accel')
def accel():
    return jsonify([accel_values[0] * 10, -accel_values[1] * 10, accel_values[2]])


app.run(host='0.0.0.0', debug=True)
