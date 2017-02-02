# coding: utf8
import MySQLdb
import os
import datetime
from .conn import Connect


class Fetch(Connect):

    def __init__(self, db):
        super().__init__()
        self.db = db

    def execute(self, command, data):
        conn = self.connect(self.db)
        if command == 'lives':
            ret = self._fetch_lives(data, conn)
            for live in ret:
                live["act"] = self._fetch_acts(live["liveID"], conn)
        elif command == 'bands':
            ret = self._fetch_bands(data, conn)
        elif command == 'band':
            ret = self._fetch_band(data, conn)
        elif command == 'live':
            ret = self._fetch_live(data, conn)
            ret["act"] = self._fetch_acts(ret["liveID"], conn)
        elif command == "likes":
            ret = self._fetch_likes(data, conn)
        elif command == 'prefers':
            ret = self._fetch_prefers(data, conn)
            for live in ret:
                live["act"] = self._fetch_acts(live["liveID"], conn)
        elif command == "search":
            ret = self._sub_search(data, conn)
        elif command == "todays_pickup":
            ret = self._fetch_todays_pickup(data, conn)
            ret["act"] = self._fetch_acts(ret["liveID"], conn)
        else:
            ret = {}
        conn.close()
        return ret

    def fetch_one(self, sql):
        conn = self.connect(self.db)
        cursor = conn.cursor()
        cursor.execute(sql)
        record = cursor.fetchone()
        conn.close()
        return record

    def __encryption(self, bandID, name):
        pass

    def _fetch_lives(self, data, conn):
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        keys = [key for key in data.keys()]
        if len([x for x in keys if x == 'date']) > 0:
            sql = (
                "SELECT DISTINCT live.liveID, "
                "live.ticket, live.open, live.context, "
                "live.yyyymmdd, house.name, house.url, house.prefacture "
                "FROM live INNER JOIN house "
                "ON live.houseID = house.houseID "
                "WHERE live.yyyymmdd = %s "
                "ORDER BY house.prefacture, house.name"
            )
            cursor.execute(sql, (data["date"],))
        elif len([x for x in keys if x == 'bandID']) > 0:
            today = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y%m%d')
            sql = (
                "SELECT DISTINCT live.liveID, "
                "live.ticket, live.open, live.context, "
                "live.yyyymmdd, house.name, house.url, house.prefacture "
                "FROM live INNER JOIN house "
                "ON live.houseID = house.houseID "
                "INNER JOIN act ON live.liveID = act.liveID "
                "WHERE act.bandID = %s AND yyyymmdd > %s "
                "ORDER BY yyyymmdd, house.prefacture, house.name"
            )
            cursor.execute(sql, (data["bandID"], today))
        return list(cursor.fetchall())

    def _fetch_bands(self, data, conn):
        num = 4
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = (
          "SELECT distinct band.*, house.name AS house FROM band INNER JOIN act "
          "ON band.bandID = act.bandID INNER JOIN live ON act.liveID = live.liveID "
          "INNER JOIN house ON live.houseID = house.houseID "
          "WHERE live.yyyymmdd = %s ORDER BY band.sort_key LIMIT %s, %s"
        )
        cursor.execute(
            sql, (data["date"].strftime("%Y%m%d"), data["cnt"] * num, num))
        return cursor.fetchall()

    def _fetch_live(self, liveID, conn):
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = (
            "SELECT live.liveID, live.context, live.open, live.ticket, "
            "live.yyyymmdd, live.image, house.url, house.name "
            "FROM live INNER JOIN house ON live.houseID = house.houseID "
            "WHERE live.liveID = %s"
        )
        cursor.execute(sql, (lineID, ))
        return cursor.fetchone()

    def _fetch_likes(self, userID, conn):
        cursor = conn.cursor()
        sql = (
            "SELECT bandID FROM prefer WHERE userID = %s"
        )
        cursor.execute(sql, (userID,))
        ret = cursor.fetchall()
        return [x[0] for x in ret] if len(ret) > 0 else []

    def _fetch_prefers(self, userID, conn):
        today = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y%m%d')
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = (
            "SELECT DISTINCT live.liveID, "
            "live.ticket, live.open, live.context, "
            "live.yyyymmdd, house.name, house.url, house.prefacture FROM live "
            "INNER JOIN house ON live.houseID = house.houseID "
            "INNER JOIN act ON live.liveID = act.liveID "
            "INNER JOIN prefer ON act.bandID = prefer.bandID "
            "WHERE prefer.userID = %s AND yyyymmdd > %s "
            "ORDER BY yyyymmdd, house.prefacture, house.name"
        )
        cursor.execute(sql, (userID, today))
        return list(cursor.fetchall())

    def _fetch_acts(self, liveID, conn):
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = (
            "SELECT band.* FROM act INNER JOIN band ON "
            "act.bandID = band.bandID WHERE act.liveID = %s"
        )
        cursor.execute(sql, (liveID,))
        return list(cursor.fetchall())

    def _fetch_band(self, bandID, conn):
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = "SELECT * FROM band WHERE bandID = %s"
        cursor.execute(sql, (bandID,))
        return cursor.fetchone()

    def _sub_search(self, word, conn):
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = "SELECT * FROM band WHERE LCASE(name) like %s ORDER BY LENGTH(name)"
        cursor.execute(sql, ('%' + word.lower() + '%',))
        return list(cursor.fetchall())

    def _fetch_todays_pickup(self, data, conn):
        cursor = conn.cursor()
        sql = (
            "SELECT * FROM "
            "(SELECT act.liveID AS liveID, COUNT(act.liveID) AS cnt FROM act "
            "INNER JOIN live ON act.liveID = live.liveID WHERE yyyymmdd = %s "
            "GROUP BY 1 ORDER BY 2 DESC) AS lives WHERE cnt < 10 LIMIT 1"
        )
        cursor.execute(sql, (data["date"],))
        liveID, _ = cursor.fetchone()
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        sql = (
            "SELECT live.liveID, live.context, live.open, live.ticket, "
            "live.yyyymmdd, live.image, house.url, house.name, house.prefacture "
            "FROM live INNER JOIN house ON live.houseID = house.houseID "
            "WHERE live.liveID = %s"
        )
        cursor.execute(sql, (liveID,))
        return cursor.fetchone()
