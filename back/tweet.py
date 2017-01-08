# coding: utf-8
import os
import sys
import twitter
import datetime
from modules.util.fetch import Fetch

def fetch_pickup(date):
    fetch = Fetch("remote")
    data = fetch.execute("todays_pickup", {"date": date.strftime('%Y%m%d')})
    return data

auth = twitter.OAuth(
    consumer_key=os.getenv("TWITTER_KEY"),
    consumer_secret=os.getenv("TWITTER_KEY_SECRET"),
    token=os.getenv("TWITTER_ACCESS_TOKEN"),
    token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
)
if sys.argv[1] == "today":
    date = datetime.date.today()
else:
    date = datetime.date.today() + datetime.timedelta(days=1)
data = fetch_pickup(date)
text = (
    "【{livehouse}@{pref}】{day}のpickup Live!{bands}."
    "動画をcheck！{url}"
).format(
    day="本日" if sys.argv[1] == "today" else "明日",
    livehouse=data["name"], pref=data["prefacture"],
    bands='／'.join([x["name"] for x in data["act"]]),
    url="http://show-time.xyz/{}.html".format(date.strftime('%Y%m%d')))
t = twitter.Twitter(auth=auth)
t.statuses.update(status=text)
