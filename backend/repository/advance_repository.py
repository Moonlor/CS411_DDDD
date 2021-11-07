# -*- coding: utf-8 -*
import json
from utils.utils import datetime_to_string
from utils.connection import Connector

class AdvanceRepository(object):
    def __init__(self):
        self.connector = Connector()
    
    def get_similar_user_by_category(self, c1, c2, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        string = """select {}
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
                ON first.name = second.name and first.email = second.email {} """
        query = string.format("COUNT(*)", c1, c2, "")
        cursor.execute(query)
        total = cursor.fetchone()[0]
        query = string.format("first.name, first.email", c1, c2, f"LIMIT {limit} OFFSET {offset-1}")
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
        return ret, total

    def get_user_with_likes_more_than(self, likes, offset, limit):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        string = """select {}
                    from User u join Post p join Mention m join Restaurant r
                        on u.user_id = p.user_id and p.post_id = m.post_id and m.restaurant_id = r.restaurant_id
                    where p.likes > {}
                    {} """
        query = string.format("COUNT(*)", int(likes), "")
        cursor.execute(query)
        total = cursor.fetchone()[0]
        query = string.format("*", int(likes), f"LIMIT {limit} OFFSET {offset-1}")
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
        return ret, total