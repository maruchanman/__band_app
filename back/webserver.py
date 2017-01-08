# coding: utf-8
import datetime
from flask import Flask, redirect

app = Flask(__name__)

@app.route('/today')
def today():
    return redirect(
        'http://show-time.xyz/{}.html'.format(datetime.date.today().strftime('%Y%m%d')))

@app.route('/tommorow')
def tommorow():
    date = datetime.date.today() + datetime.timedelta(days=1)
    return redirect(
        'http://show-time.xyz/{}.html'.format(date.strftime('%Y%m%d')))

if __name__ == '__main__':
    app.run(port=9997)
