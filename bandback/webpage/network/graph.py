from collections import Counter
import MySQLdb
from ..webpage..util.conn import Connect


class Graph(Connect):
    
    def __init__(self):
        super().__init__()

    def create(self, db):
        data = self.__load_data(db)
        keyval = self.__keyval(data)
        return keyval

    def __load_data(self, db):
        sql = (
            "SELECT act.liveID, act.bandID, band.name FROM act "
            "INNER JOIN band ON act.bandID = band.bandID"
        )
        with self.connect(db).cursor(MySQLdb.cursors.DictCursor) as cur:
            cur.execute(sql)
            data = cur.fetchall()
        return data

    def __keyval(self, data):
        r = {}
        for bandID in set([x["bandID"] for x in data]):
            lives = [x["liveID"] for x in data if x["bandID"] == bandID]
            bands = [x["bandID"] for x in data if x["liveID"] in lives and x["bandID"] != bandID]
            r[bandID] = Counter(bands)
        return r
