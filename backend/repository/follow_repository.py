# -*- coding: utf-8 -*
import json
from flask import request
from utils.utils import datetime_to_string, string_to_datetime
from utils.connection import Connector

class FollowRepository(object):
    def __init__(self):
        self.connector = Connector()

    def get_profile_following_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM User WHERE user_id IN (SELECT following_id FROM Follow WHERE follower_id=%s)")
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

    def get_profile_follower_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM User WHERE user_id IN (SELECT follower_id FROM Follow WHERE following_id=%s)")
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

    def set_profile_follow_by_id(self, id1, id2):
        params = request.json
        id = params.get('id')
        # format to be decided
        date = params.get('date')
        converted_birth_data = string_to_datetime(date)
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("INSERT INTO Follow(id, follower_id, following_id, date) VALUES(%s, %s, %s, %s)")
        cursor.execute(query, (id, id1, id2, converted_birth_data))
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def delete_profile_follow_by_id(self, id1, id2):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("DELETE FROM Follow WHERE follower_id=%s AND following_id=%s")
        cursor.execute(query, (id1, id2))
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount