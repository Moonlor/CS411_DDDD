# -*- coding: utf-8 -*
import json
from utils.utils import datetime_to_string
from utils.connection import Connector

class CommentRepository(object):
    def __init__(self):
        self.connector = Connector()

    def get_profile_comment_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Comment WHERE user_id=%s")
        cursor.execute(query, (id,))
        profiles = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in profiles:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return json.dumps(ret)


