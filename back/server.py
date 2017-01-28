# coding: utf-8
import os
import re
import random
import datetime
import pandas as pd
from flask import Flask, render_template, jsonify, after_this_request, request
from modules.util.insert import Insert
from modules.util.fetch import Fetch
from modules.util.conn import Connect

app = Flask(__name__)
CURRENTPATH = os.path.dirname(__file__)
handle = Insert("remote")
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

def __fix_context(context):
    sub_pattern = [
        "\(.+?\)",
        "【.+?】",
        "（.+?）"
    ]
    replace_pattern = [
        "■"
        ":",
        "："
    ]
    s = context
    for pattern in sub_pattern:
        s = re.sub(pattern, "", s)
    for pattern in replace_pattern:
        s = s.replace(pattern, "/")
    return s


@app.route('/b', methods=['GET'])
def confirm():
    return "Flask server is running !!"


@app.route('/b/check', methods=['GET', 'POST'])
def check_band():
    with open('./check/bands.txt', 'r') as f:
        bands = f.read()
        bands = bands.split('\n')
    if request.method == 'POST':
        band = request.form["name"]
        bands.remove(band)
        if request.form["flag"] == "YES":
            handle.insert_band(band, request.form["video"])
        with open('./check/bands.txt', 'w') as f:
            f.write('\n'.join(bands))
    band = bands[0]
    return render_template(
        'band.html', band=band, video=handle._video(band), N=len(bands))


@app.route('/b/bandadd', methods=['GET', 'POST'])
def band_add():
    if request.method == 'POST':
        bands = request.form.getlist("bands")
        liveID = request.form["liveID"]
        with open("./check/bands.txt", "a") as f:
            for band in bands:
                f.write("{}\n".format(band))
        sql = "UPDATE live SET checked = 1 WHERE liveID = %s"
        conn = db.connect("remote")
        cur = conn.cursor()
        cur.execute(sql, (liveID, ))
        conn.commit()
        conn.close()
    today = datetime.date.today()
    sql = (
        "SELECT liveID, context FROM live WHERE checked IS NULL "
        "AND yyyymmdd > {} AND context IS NOT NULL ORDER BY yyyymmdd LIMIT 1"
    ).format(today.strftime('%Y%m%d'))
    liveID, context = fetch.fetch_one(sql)
    context = __fix_context(context)
    bands = [x for x in context.split('/') if len(x) < 20 and x != '']
    return render_template(
        'bandadd.html', bands=bands, liveID=liveID)


@app.route('/b/like', methods=['POST'])
def post_like():
    userID = request.form["userID"]
    bandID = request.form["bandID"]
    handle.update_like(userID, bandID)
    return jsonify({"status": "ok"})


@app.route('/b/bands/<int:year>/<int:month>/<int:day>/<int:cnt>')
def fetch_bands(year, month, day, cnt):
    date = datetime.date(year, month, day)
    data = fetch.execute("bands", {"date": date, "cnt": cnt})
    return jsonify(data)

@app.route('/b/lives/<int:year>/<int:month>/<int:day>')
def fetch_lives(year, month, day):
    date = datetime.date(year, month, day)
    data = fetch.execute("lives", {"date": date.strftime('%Y%m%d')})
    for ix, dic in enumerate(data):
        data[ix]["url"] = _fix_url(dic["url"], dic["yyyymmdd"])
    return jsonify(data)


@app.route('/b/likes/<userID>')
def fetch_likes(userID):
    data = fetch.execute("likes", userID)
    return jsonify(data)


@app.route('/b/live/<int:liveID>')
def fetch_live(liveID):
    data = fetch.execute("live", liveID)
    data["url"] = _fix_url(data["url"], data["yyyymmdd"])
    return jsonify(data)


@app.route('/b/band/<int:bandID>')
def fetch_band(bandID):
    data = fetch.execute("band", bandID)
    return jsonify(data)


@app.route('/b/schedule/<int:bandID>')
def fetch_schedule(bandID):
    data = fetch.execute("lives", {"bandID": bandID})
    for ix, dic in enumerate(data):
        data[ix]["url"] = _fix_url(dic["url"], dic["yyyymmdd"])
    return jsonify(data)

@app.route('/b/prefers', methods=['POST'])
def fetch_prefers():
    userID = request.form["userID"]
    data = fetch.execute("prefers", userID)
    for ix, dic in enumerate(data):
        data[ix]["url"] = _fix_url(dic["url"], dic["yyyymmdd"])
    return jsonify(data)

@app.route('/b/search/<word>')
def sub_search(word):
    data = fetch.execute('search', word)
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=9998)
