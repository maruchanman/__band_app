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
        sql = "SELECT count(*) FROM band WHERE name = %s"
        cur.execute(sql, (name.replace("'", "''"),))
        if cur.fetchone()[0] == 0:
            sql = (
                "INSERT INTO band (name, video) VALUES (%s, %s)"
            )
            cur.execute(sql, (name.replace("'", "''"), video))
        conn.commit()
        conn.close()

    def insert_house(self, df):
        conn = self.connect(self.db)
        cur = conn.cursor()
        for houseID, house in df.iterrows():
            self._house(houseID, house, cur)
        conn.commit()
        conn.close()

    def update_like(self, userID, bandID):
        conn = self.connect(self.db)
        cur = conn.cursor()
        sql = (
            "SELECT count(*), bandID FROM prefer WHERE "
            "bandID = %s AND userID = %s"
        )
        cur.execute(sql, (bandID, userID))
        cnt, _ = cur.fetchone()
        if cnt == 0:
            sql = (
                "INSERT INTO prefer (userID, bandID) VALUES (%s, %s)"
            )
            cur.execute(sql, (userID, bandID))
        else:
            sql = (
                "DELETE FROM prefer WHERE userID = %s AND bandID = %s"
            )
            cur.execute(sql, (userID, bandID))
        conn.commit()
        conn.close()
  
    def _live(self, live, info, cur):
        if len(live["html"]) > 0:
            houseID, year, month = info
            month = self._zerohead(month)
            day = self._zerohead(live["date"])
            yyyymmdd = '{0}{1}{2}'.format(year, month, day)
            context = live["html"].replace("'", "''")
            time = live["time"][0] if len(live["time"]) > 0 else "NULL"
            ticket = live["price"][0] if len(live["price"]) > 0 else "NULL"
            sql = (
                "SELECT count(*), liveID FROM live WHERE "
                "houseID = %s AND yyyymmdd = %s AND open = %s"
            )
            cur.execute(sql, (houseID, yyyymmdd, time))
            cnt, liveID = cur.fetchone()
            if cnt == 0:
                sql = (
                    "INSERT INTO live (houseID, context, open, ticket, image, yyyymmdd) "
                    "VALUES (%s, %s, %s, %s, %s, %s)"
                )
                cur.execute(
                    sql,
                    (houseID, context, time, ticket, live["image"].replace("'", "''"), yyyymmdd)
                )
                return cur.lastrowid
            else:
                sql = (
                    "UPDATE live SET context = %s, ticket = %s, open = %s "
                    "WHERE liveID = %s"
                )
                cur.execute(sql, (context, ticket, time, liveID))
                return liveID
        else:
            return False
  
    def _act(self, liveID, act, cur):
        for band in act:
            sql = (
                "SELECT count(*), bandID FROM band WHERE name = %s"
            )
            cur.execute(sql, (band.replace("'", "''"), ))
            cnt, bandID = cur.fetchone()
            if cnt > 0:
                sql = (
                    "SELECT count(*) FROM act WHERE bandID = %s AND liveID = %s"
                )
                cur.execute(sql, (bandID, liveID))
                if cur.fetchone()[0] == 0:
                    sql = (
                        "INSERT INTO act (liveID, bandID) VALUES (%s, %s)"
                    )
                    cur.execute(sql, (liveID, bandID))

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
        sql = "SELECT count(1) FROM house WHERE houseID = %s"
        cur.execute(sql, (houseID,))
        if cur.fetchone()[0] == 0:
            sql = (
                "INSERT INTO house (houseID, prefacture, name, url)"
                " VALUES (%s, %s, %s, %s)"
            )
            cur.execute(sql, (houseID, house["prefacture"], name, house["url"]))

    def _zerohead(self, number):
        return str(number) if number > 9 else '0{}'.format(number)
