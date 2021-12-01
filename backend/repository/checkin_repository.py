# -*- coding: utf-8 -*
import json
from utils.utils import datetime_to_string
from utils.connection import Connector

class CheckinRepository(object):
    def __init__(self):
        self.connector = Connector()

    def get_checkin_by_userid(self, userid, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT COUNT(*) FROM CheckIn CheckIn NATURAL JOIN Restaurant r WHERE user_id=%s")
        cursor.execute(query, (userid,))
        total = cursor.fetchone()[0]
        query = ("SELECT * FROM CheckIn NATURAL JOIN Restaurant r WHERE user_id=%s LIMIT %s OFFSET %s")
        cursor.execute(query, (userid, limit, offset-1))
        profiles = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in profiles:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return ret, total