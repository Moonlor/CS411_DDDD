# -*- coding: utf-8 -*
import json
import uuid
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
        cursor.execute(query, (id,))
        cnx.commit()
        count = cursor.rowcount
        cursor.close()
        cnx.close()
        return count

    def get_all_posts(self, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        cursor.execute("SELECT COUNT(*) FROM Post")
        total = cursor.fetchone()[0]
        query = ("SELECT * FROM Post LIMIT %s OFFSET %s")
        cursor.execute(query, (limit, offset - 1))
        posts = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in posts:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return ret, total

    def get_post_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Post WHERE post_id=%s")
        cursor.execute(query, (id,))
        posts = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        row_headers.append('restaurant')
        ret = []
        for p in posts:
            p = list(p)
            datetime_to_string(p)
            restaurants = self.get_restaurant_by_post_id(id)
            p.append(restaurants)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return ret

    def get_restaurant_by_post_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Restaurant WHERE restaurant_id IN (SELECT restaurant_id FROM Mention WHERE post_id=%s)")
        cursor.execute(query, (id,))
        restaurants = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in restaurants:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return ret

    def get_posts_by_restaurant_id(self, id, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        cursor.execute("SELECT COUNT(post_id) FROM Mention WHERE restaurant_id='{}'".format(id))
        total = cursor.fetchone()[0]
        query = ("SELECT * FROM Post WHERE post_id IN (SELECT post_id FROM Mention WHERE restaurant_id=%s) LIMIT %s OFFSET %s")
        cursor.execute(query, (id, limit, offset - 1))
        posts = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in posts:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return ret, total

    def create_post(self):
        params = request.json
        # format to be decided
        post_id = uuid.uuid4().hex[:30]
        stars = params.get('stars')
        date = params.get('date')
        converted_data = string_to_datetime(date)
        text = params.get('text')
        user_id = params.get('user_id')
        restaurant_ids = params.get('restaurant_ids')
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("INSERT INTO Post(post_id, stars,date,text,user_id) VALUES(%s, %s, %s, %s, %s)")
        cursor.execute(query, (post_id, stars, converted_data, text, user_id))
        self.create_mention(post_id, restaurant_ids, converted_data)
        # cnx.commit()
        cursor.close()
        cnx.close()
        return [{'post_id':post_id}]

    def create_mention(self, post_id, restaurant_ids, date):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("INSERT INTO Mention(post_id,restaurant_id,date) VALUES(%s, %s, %s)")
        data_list = []
        for rid in restaurant_ids:
            data_list.append((post_id, rid, date))
        cursor.executemany(query, data_list)
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def update_post(self):
        params = request.json
        post_id = params.get('post_id')
        date = params.get('date')
        text = params.get('text')
        converted_data = string_to_datetime(date)
        # restaurant_ids = params.get('restaurant_ids')
        # self.update_mention(post_id, restaurant_ids, date)
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("UPDATE Post SET date=%s, text=%s WHERE post_id=%s")
        cursor.execute(query, (converted_data, text, post_id))
        cnx.commit()
        cursor.close()
        cnx.close()
        return [{'post_id': post_id}]

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



