# coding: utf-8

import urllib
import requests
from bs4 import BeautifulSoup
from .conn import Connect


class Insert(Connect):

    def __init__(self, db):
        super().__init__()
        self.db = db

    def insert_live(self, dic):
        conn = self.connect(self.db)
        cur = conn.cursor()
        for lives in dic:
            for live in lives["data"]:
                liveid = self._live(live, [lives["houseID"], lives["year"], lives["month"]], cur)
                if liveid:
                    self._act(liveid, live["bands"], cur)
        conn.commit()
        conn.close()

    def insert_band(self, name, video):
        conn = self.connect(self.db)
        cur = conn.cursor()
        sql = "SELECT count(*) FROM band WHERE name = '{}'".format(name.replace("'", "''"))
        cur.execute(sql)
        if cur.fetchone()[0] == 0:
            sql = (
                "INSERT INTO band (name, video) VALUES ('{0}', '{1}')"
            ).format(name.replace("'", "''"), video)
            cur.execute(sql)
        conn.commit()
        conn.close()

    def insert_house(self, df):
        conn = self.connect(self.db)
        cur = conn.cursor()
        for houseID, house in df.iterrows():
            self._house(houseID, house, cur)
        conn.commit()
        conn.close()
  
    def _live(self, live, info, cur):
        if len(live["time"]) > 0:
            houseID, year, month = info
            month = self._zerohead(month)
            day = self._zerohead(live["date"])
            yyyymmdd = '{0}{1}{2}'.format(year, month, day)
            sql = (
                "SELECT count(*), liveID FROM live WHERE "
                "houseID = {0} AND yyyymmdd = {1} AND open = '{2}'"
            )
            sql = sql.format(houseID, yyyymmdd, live["time"][0])
            cur.execute(sql)
            context = live["html"].replace("'", "''")
            ticket = live["price"][0] if len(live["price"]) > 0 else "NULL"
            cnt, liveID = cur.fetchone()
            if cnt == 0:
                sql = (
                    "INSERT INTO live (houseID, context, open, ticket, image, yyyymmdd) "
                    "VALUES ({0}, '{1}', '{2}', {3}, '{4}', {5})"
                )
                sql = sql.format(
                    houseID, context, live["time"][0],
                    ticket, live["image"].replace("'", "''"), yyyymmdd)
                cur.execute(sql)
                return cur.lastrowid
            else:
                sql = "UPDATE live SET context = '{0}', ticket = {1} WHERE liveID = {2}"
                sql = sql.format(context, ticket, liveID)
                cur.execute(sql)
                return liveID
        else:
            return False
  
    def _act(self, liveID, act, cur):
        for band in act:
            sql = (
                "SELECT count(*), bandID FROM band WHERE name = '{}'"
            ).format(band.replace("'", "''"))
            cur.execute(sql)
            cnt, bandID = cur.fetchone()
            if cnt > 0:
                sql = (
                    "SELECT count(*) FROM act WHERE bandID = {0} AND liveID = {1}"
                ).format(bandID, liveID)
                cur.execute(sql)
                if cur.fetchone()[0] == 0:
                    sql = (
                        "INSERT INTO act (liveID, bandID) VALUES ({0}, {1})"
                    ).format(liveID, bandID)
                    cur.execute(sql)

    def _video(self, band):
        url = "http://video.search.yahoo.co.jp/search?p=%s&ei=UTF-8&rkf=1&oq="
        if len(band) > 4:
            url = url % urllib.parse.quote(band)
        else:
            url = url % urllib.parse.quote(band + " バンド")
        soup = BeautifulSoup(requests.get(url).text)
        boxes = soup.select("h2 a")
        video = "NULL"
        for box in boxes:
            if box.attrs.get("href").find("youtube") != -1 and box.attrs.get("title").find(band) != -1:
                video = box.attrs.get("href").split("?v=")[1][:11]
                break
        return video

    def _house(self, houseID, house, cur):
        name = house["name"].replace("'", "''")
        sql = "SELECT count(1) FROM house WHERE houseID = {}".format(houseID)
        cur.execute(sql)
        if cur.fetchone()[0] == 0:
            sql = (
                "INSERT INTO house (houseID, prefacture, name, url)"
                " VALUES ({0}, '{1}', '{2}', '{3}')"
            ).format(houseID, house["prefacture"], name, house["url"])
            cur.execute(sql)

    def _zerohead(self, number):
        return str(number) if number > 9 else '0{}'.format(number)
