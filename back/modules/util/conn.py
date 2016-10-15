# coding: utf-8

import MySQLdb
import os


class Connect():

    def __init__(self):
        pass

    def connect(self, db):
        if db == "remote":
            connection = self.__remote()
        elif db == "local":
            connection = self.__local()
        else:
            raise Exception('db "{}" does no exist'.format(db))
        return MySQLdb.connect(**connection)

    def __remote(self):
        return {
            "db": 'gigs',
            "host": os.getenv('GIGS_HOST'),
            "user": "kadoya",
            "passwd": os.getenv('GIGS_PASS'),
            "port": 3306,
            "charset": 'utf8'
        }

    def __local(self):
        return {
            "db": 'gigs',
            "host": 'localhost',
            "user": "root",
            "passwd": os.getenv('LOCALDB_PASS')
        }
