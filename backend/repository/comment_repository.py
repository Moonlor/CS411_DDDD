# -*- coding: utf-8 -*
import json
import uuid
from utils.utils import datetime_to_string, string_to_datetime
from utils.connection import Connector

class CommentRepository(object):
    def __init__(self):
        self.connector = Connector()

    def get_profile_comment_by_id(self, id, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT COUNT(*) FROM Comment WHERE user_id=%s")
        cursor.execute(query, (id,))
        total = cursor.fetchone()[0]
        query = ("SELECT * FROM Comment WHERE user_id=%s LIMIT %s OFFSET %s")
        cursor.execute(query, (id, limit, offset-1))
        profiles = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]
        #index 2 is datetime
        profiles.sort(key=lambda x:x[2], reverse=True)
        ret = []
        for p in profiles:
            p = list(p)
            datetime_to_string(p)
            ret.append(dict(zip(row_headers, p)))
        cursor.close()
        cnx.close()
        return ret, total

    def get_comment_by_post_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM Post_Comment JOIN Comment USING(post_comment_id)" +
                 "NATURAL JOIN (SELECT user_id, first_name, last_name FROM User) AS u " +
                 "WHERE post_comment_id in (SELECT post_comment_id FROM Respond WHERE post_id = %s) " +
                 "ORDER BY Comment.date DESC")
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

    def create_post_comment(self, request):
        params = request.json
        post_comment_id = uuid.uuid4().hex[:30]
        likes = params.get('likes')
        date = params.get('date')
        text = params.get('text')
        user_id = params.get('user_id')
        post_id = params.get('post_id')
        converted_data = string_to_datetime(date)
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        query = ("INSERT INTO Post_Comment(post_comment_id, date,text,likes) VALUES(%s, %s, %s, %s)")
        cursor.execute(query, (post_comment_id, converted_data, text, likes))
        self.create_comment(cnx, post_comment_id, user_id, date)
        self.create_respond(cnx, post_comment_id, post_id, date)
        cnx.commit()
        cursor.close()
        cnx.close()
        return [{'id': post_comment_id}]

    def create_comment(self, cnx, post_comment_id, user_id, date):
        cursor = cnx.cursor()
        query = ("INSERT INTO Comment(post_comment_id,user_id,date) VALUES(%s,%s,%s)")
        cursor.execute(query, (post_comment_id, user_id, date))

    def create_respond(self, cnx, post_comment_id, post_id, date):
        cursor = cnx.cursor()
        query = ("INSERT INTO Respond(post_comment_id,post_id,date) VALUES(%s,%s,%s)")
        cursor.execute(query, (post_comment_id, post_id, date))

    def delete_post_comment_by_post_comment_id(self, id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        cursor.execute("DELETE FROM Post_Comment WHERE post_comment_id={}".format(id))
        count = cursor.rowcount
        cnx.commit()
        cursor.close()
        cnx.close()
        return count
