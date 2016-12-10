# coding: utf-8
import os
import datetime
from jinja2 import Environment, FileSystemLoader
from modules.util.fetch import Fetch

def _fix_url(url, yyyymmdd):
    year, month = [int(str(yyyymmdd)[:4]), int(str(yyyymmdd)[4:6])]
    url = url.replace("%4d", str(year))
    url = url.replace("%2d", str(year - 2000))
    url = url.replace("%d", str(month))
    url = url.replace("%s", str(month) if month > 9 else '0{}'.format(month))
    url = url.replace("%-s", str(month - 1))
    return url

def fetch_pickup():
    fetch = Fetch("remote")
    date = datetime.date.today()
    data = fetch.execute("todays_pickup", {"date": date.strftime('%Y%m%d')})
    data["url"] = _fix_url(data["url"], data["yyyymmdd"])
    return data

r = fetch_pickup()
env = Environment(loader=FileSystemLoader('./', encoding='utf8'))
tpl = env.get_template('./templates/todays_pickup.html')
html = tpl.render({
    'date': datetime.date.today().strftime('%Y/%m/%d'),
    'act': r["act"],
    "house": r["name"]
})
with open("./todays_pickups/{}.html".format(r["yyyymmdd"]), 'w') as f:
  f.write(html)
