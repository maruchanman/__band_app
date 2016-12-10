# coding: utf-8
import os
import re
import random
import datetime
import pandas as pd
from flask import Flask, render_template, jsonify, request
from modules.util.fetch import Fetch
from modules.util.conn import Connect

app = Flask(__name__)
CURRENTPATH = os.path.dirname(__file__)
fetch = Fetch("remote")
db = Connect()

def _fix_url(url, yyyymmdd):
    year, month = [int(str(yyyymmdd)[:4]), int(str(yyyymmdd)[4:6])]
    url = url.replace("%4d", str(year))
    url = url.replace("%2d", str(year - 2000))
    url = url.replace("%d", str(month))
    url = url.replace("%s", str(month) if month > 9 else '0{}'.format(month))
    url = url.replace("%-s", str(month - 1))
    return url

@app.route('/band_web', methods=['GET'])
def confirm():
    return "Flask server is running !!"

@app.route('/band_web/lives')
def fetch_lives():
    date = datetime.date.today()
    data = fetch.execute("lives", {"date": date.strftime('%Y%m%d')})
    for ix, dic in enumerate(data):
        data[ix]["url"] = _fix_url(dic["url"], dic["yyyymmdd"])
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=9997)
