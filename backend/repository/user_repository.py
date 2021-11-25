# -*- coding: utf-8 -*
import json
import uuid

from flask import request
from utils.utils import datetime_to_string, string_to_datetime
from utils.connection import Connector

class UserRepository(object):
    
    def __init__(self):
        self.connector = Connector()

    def get_profile_by_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM User WHERE user_id=%s")
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
        return ret

    def get_profile_by_email(self, cnx, email):
        cursor = cnx.cursor()
        query = ("SELECT * FROM User WHERE email=%s")
        cursor.execute(query, (email,))
        profiles = cursor.fetchall()
        ret = len(profiles)
        return ret

    def set_profile_by_id(self, id):
        params = request.json
        first_name = params.get('first_name')
        last_name = params.get('last_name')
        # format to be decided
        birth_data = params.get('birth_date')
        converted_birth_data = string_to_datetime(birth_data)
        mobile = params.get('mobile')
        gender = params.get('gender')
        password = params.get('password')
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("UPDATE User SET first_name=%s, last_name=%s, birth_date=%s, mobile=%s, gender=%s, password=%s WHERE user_id=%s")
        cursor.execute(query, (first_name, last_name, converted_birth_data, mobile, gender, password, id))
        cnx.commit()
        cursor.close()
        cnx.close()
        return cursor.rowcount

    def signup(self):
        params = request.json
        user_id = uuid.uuid4().hex[:30]
        email = params.get('email')
        password = params.get('password')
        first_name = params.get('first_name')
        birth_date = params.get('birth_date')
        mobile = params.get('mobile')
        gender = params.get('gender')
        last_name = params.get('last_name')
        converted_data = string_to_datetime(birth_date)
        cnx = self.connector.open_connection()
        users = self.get_profile_by_email(cnx, email)
        if users > 0:
            return []
        cursor = cnx.cursor()
        query = ("INSERT INTO User(user_id, first_name, last_name, birth_date, mobile, email, gender, password) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)")
        cursor.execute(query, (user_id, first_name, last_name, converted_data, mobile, email, gender, password))
        cnx.commit()
        cursor.close()
        cnx.close()
        return [{'user_id': user_id}]

    def login(self):
        params = request.json
        email = params.get('email')
        password = params.get('password')
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM User WHERE email=%s AND password=%s")
        cursor.execute(query, (email, password))
        profiles = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        ret = []
        for p in profiles:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        if len(ret) > 0:
            return [{"user_id": ret[0]['user_id']}]
        else:
            return []



