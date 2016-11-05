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
        else:
            ret = {}
        conn.close()
        return ret

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
        return cursor.fetchall()

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
