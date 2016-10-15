# coding: utf-8
import os
import random
import datetime
import pandas as pd
from flask import Flask, render_template, jsonify, after_this_request, request
from modules.util.insert import Insert
from modules.util.fetch import Fetch

app = Flask(__name__)
CURRENTPATH = os.path.dirname(__file__)
handle = Insert("remote")


def _fix_url(url, yyyymmdd):
    year, month = [int(str(yyyymmdd)[:4]), int(str(yyyymmdd)[4:6])]
    url = url.replace("%4d", str(year))
    url = url.replace("%2d", str(year - 2000))
    url = url.replace("%d", str(month))
    url = url.replace("%s", str(month) if month > 9 else '0{}'.format(month))
    url = url.replace("%-s", str(month - 1))
    return url


@app.route('/b', methods=['GET'])
def confirm():
    return "Flask server is running !!"


@app.route('/b/check', methods=['GET'])
def check_band():
    df = pd.read_csv('./static/check.csv', index_col=0)
    idx = df[df.flag.isnull()].index[0]
    band = df.ix[idx].band
    return render_template(
        'band.html', band=band, bandID=idx, video=handle._video(band))


@app.route('/b/check', methods=['POST'])
def post_band():
    if request.form["flag"] == "allok":
        flag = 1
        insert = Insert("remote")
        insert.insert_band(request.form["name"], request.form["video"])
    elif request.form["flag"] == "ok":
        flag = 0
    else:
        flag = -1
    df = pd.read_csv('./static/check.csv', index_col=0)
    df.ix[int(request.form["band_id"]), "flag"] = flag
    df.to_csv('./static/check.csv')
    data = df[df.flag.isnull()]
    idx = data.index[0]
    band = df.ix[idx].band
    return render_template(
        'band.html', band=band, bandID=idx, video=handle._video(band))


# - select  -----------------------------

fetch = Fetch("local")


@app.route('/b/lives/<int:year>/<int:month>/<int:day>')
def list_live(year, month, day):
    date = datetime.date(year, month, day)
    data = fetch.execute("lives", {"date": date.strftime('%Y%m%d')})
    print(data)

    @after_this_request
    def d_header(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    return jsonify(data)


@app.route('/b/live/<int:liveID>')
def fetch_live(liveID):
    data = fetch.execute("live", liveID)
    data["url"] = _fix_url(data["url"], data["yyyymmdd"])
    print(data)

    @after_this_request
    def d_header(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    return jsonify(data)


@app.route('/b/band/<int:bandID>')
def fetch_band(bandID):
    data = fetch.execute("band", bandID)

    @after_this_request
    def d_header(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    return jsonify(data)


@app.route('/b/schedule/<int:bandID>')
def list_schedule(bandID):
    data = fetch.execute("lives", {"bandID": bandID})

    @after_this_request
    def d_header(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    return jsonify(data)


if __name__ == '__main__':
    app.run(port=9998)
