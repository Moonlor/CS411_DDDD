# -*- coding: utf-8 -*
import json
from utils.utils import datetime_to_string
from utils.connection import Connector

class AdvanceRepository(object):
    def __init__(self):
        self.connector = Connector()
    
    def get_similar_user_by_category(self, c1, c2):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        string = """select first.name, first.email
                FROM
                (
                    select concat(first_name, ' ', last_name) name, email
                    from User
                    where user_id in (
                        select u.user_id
                        from User u
                                join Mention m
                                join Post p
                                join Restaurant r
                                    on u.user_id = p.user_id and p.post_id = m.post_id and m.restaurant_id = r.restaurant_id
                        where r.categories like '%{}%'
                        group by u.user_id
                    )
                ) as first
                inner join
                (select concat(first_name, ' ', last_name) name, email
                    from User
                    where user_id in (
                        select u.user_id
                        from User u
                                join Mention m
                                join Post p
                                join Restaurant r
                                    on u.user_id = p.user_id and p.post_id = m.post_id and m.restaurant_id = r.restaurant_id
                        where r.categories like '%{}%'
                        group by u.user_id
                )
                ) as second
                ON first.name = second.name and first.email = second.email
                LIMIT 15"""
        query = string.format(c1, c2)
        cursor.execute(query)
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

    def get_user_with_likes_more_than(self, likes):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        string = """select concat(u.first_name, ' ', u.last_name) name, p.post_id, r.name, p.likes
                    from User u join Post p join Mention m join Restaurant r
                        on u.user_id = p.user_id and p.post_id = m.post_id and m.restaurant_id = r.restaurant_id
                    where p.likes > {}
                    limit 15"""
        query = string.format(int(likes))
        cursor.execute(query)
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