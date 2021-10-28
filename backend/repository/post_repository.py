# -*- coding: utf-8 -*
import json
from flask import request
from utils.utils import datetime_to_string, string_to_datetime
from utils.connection import Connector

class PostRepository(object):
    def __init__(self):
        self.connector = Connector()

    def get_profile_post_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Post WHERE user_id=%s")
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

    def delete_post_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("DELETE FROM Post WHERE post_id=%s")
        cursor.execute(query, id)
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def get_all_posts(self, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Post OFFSET %s LIMIT %s")
        cursor.execute(query, (offset, limit))
        posts = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in posts:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return json.dumps(ret)

    def get_post_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Post WHERE post_id=%s")
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

    def get_posts_by_restaurant_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Post WHERE post_id IN (SELECT post_id FROM Mention WHERE restaurant=%s)")
        cursor.execute(query, (id,))
        posts = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in posts:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return json.dumps(ret)

    def create_post(self):
        params = request.json
        # format to be decided
        post_id = "" # TODO: post_id generate
        stars = params.get('stars')
        date = params.get('date')
        text = params.get('text')
        user_id = params.get('user_id')
        converted_data = string_to_datetime(date)
        restaurant_ids = params.get('restaurant_ids')
        self.create_mention(post_id, restaurant_ids, converted_data)
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("INSERT INTO Follow(stars,date,text,user_id) VALUES(%s, %s, %s, %s)")
        cursor.execute(query, (stars, converted_data, text, user_id))
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def create_mention(self, post_id, restaurant_ids, date):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("INSERT INTO Mention(post_id,restaurant_id,date) VALUES(%s, %s, %s)")
        data_list = []
        for rid in restaurant_ids:
            data_list.append((post_id, rid, date))
        cursor.execute(query, data_list)
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def update_post(self):
        params = request.json
        post_id = params.get('post_id')
        stars = params.get('stars')
        date = params.get('date')
        text = params.get('text')
        converted_data = string_to_datetime(date)
        restaurant_ids = params.get('restaurant_ids')
        self.update_mention(post_id, restaurant_ids, date)
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("UPDATE User SET stars=%s, date=%s, text=%s WHERE post_id=%s")
        cursor.execute(query, (stars, converted_data, text, post_id))
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def update_mention(self, post_id, restaurant_ids, date):
        cnx = self.connector.open_connection()

        cursor = cnx.cursor()
        del_query = ("DELETE FROM Mention WHERE post_id=%s")
        cursor.execute(del_query, post_id)
        cnx.commit()

        query = ("INSERT INTO Mention(post_id,restaurant_id,date) VALUES(%s, %s, %s)")
        data_list = []
        for rid in restaurant_ids:
            data_list.append((post_id, rid, date))
        cursor.execute(query, data_list)
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount



