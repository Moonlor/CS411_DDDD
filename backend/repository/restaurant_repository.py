# -*- coding: utf-8 -*

from utils.connection import Connector
from utils.utils import datetime_to_string, string_to_datetime
import json

class RestaurantRepository(object):
    def __init__(self):
        self.connector = Connector()

    def get_restaurant_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Restaurant WHERE restaurant_id=%s")
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

    def search_restaurant_by_keyword(self, keyword):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Restaurant WHERE categories LIKE %s OR name LIKE %s ORDER BY restaurant_id")
        cursor.execute(query, ('%' + keyword + '%', '%' + keyword + '%'))
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

