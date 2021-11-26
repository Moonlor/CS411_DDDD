# DROP PROCEDURE IF EXISTS RECOMMEND_FOLLOW;
# CREATE PROCEDURE RECOMMEND_FOLLOW(IN likes INT, IN current_user_id VARCHAR(31))
# BEGIN
#     DECLARE user_cur_id VARCHAR(31);
#     DECLARE prev_cur_id VARCHAR(31) default '';

#     DECLARE finish BOOLEAN DEFAULT 0;
#     DECLARE user_cur CURSOR FOR(
#         SELECT DISTINCT u.user_id
#         FROM User u JOIN Post p
#             ON u.user_id = p.user_id
#         WHERE p.likes > likes AND u.user_id NOT IN
#         (
#             SELECT distinct Follow.following_id
#             FROM Follow
#             WHERE Follow.follower_id = current_user_id
#         )
#     );
#     DECLARE CONTINUE HANDLER FOR NOT FOUND SET finish = 1;

#     SELECT distinct r.restaurant_id, r.name, r.stars, r.categories
#     FROM User u JOIN Post p JOIN Mention m JOIN Restaurant r
#     ON u.user_id = p.user_id AND p.post_id = m.post_id AND m.restaurant_id = r.restaurant_id
#     WHERE u.user_id IN (
#         SELECT DISTINCT u.user_id
#         FROM User u JOIN Post p
#             ON u.user_id = p.user_id
#         WHERE p.likes > likes AND u.user_id NOT IN
#         (
#             SELECT distinct Follow.following_id
#             FROM Follow
#             WHERE Follow.follower_id = current_user_id
#         )
#     )
#     LIMIT 20;


#     SELECT distinct city.city_id, city.city_name
#     FROM User u JOIN CheckIn c JOIN Restaurant r JOIN Locate l JOIN Address a JOIN City city
#     ON u.user_id = c.user_id AND c.restaurant_id = r.restaurant_id AND r.restaurant_id = l.restaurant_id
#            AND l.address_id = a.address_id AND a.city_id = city.city_id
#     WHERE u.user_id IN (
#         SELECT DISTINCT u.user_id
#         FROM User u JOIN Post p
#             ON u.user_id = p.user_id
#         WHERE p.likes > likes AND u.user_id NOT IN
#         (
#             SELECT distinct Follow.following_id
#             FROM Follow
#             WHERE Follow.follower_id = current_user_id
#         )
#     )
#     LIMIT 20;

#     SELECT a.street as location, COUNT(*) as check_in_count
#     FROM CheckIn c JOIN Restaurant r JOIN Locate l JOIN Address a
#     ON c.restaurant_id = r.restaurant_id AND r.restaurant_id = l.restaurant_id
#            AND l.address_id = a.address_id
#     GROUP BY a.street
#     HAVING a.street != 'None'
#     ORDER BY check_in_count DESC
#     LIMIT 10;

#     OPEN user_cur;
#     REPEAT
#         FETCH user_cur INTO user_cur_id;
#         IF user_cur_id != current_user_id AND user_cur_id != prev_cur_id THEN
#             SET prev_cur_id = user_cur_id;
#             INSERT INTO Follow (follower_id, following_id)
#             VALUES (current_user_id, user_cur_id);
#         END IF;
#     UNTIL finish
#     END REPEAT;
#     CLOSE user_cur;
# END;


# The stored procedure is used for following popular users in batch: For example, RECOMMEND_FOLLOW(50, user_a) will help user 
# follow all users having posts with more than 50 likes

# The stored procedure returned three advance queries:
#   1. all restaurants that the popular users mentioned in their posts
#   2. all cities that the popular users have visited
#   3. top 10 mostly visited places

# -*- coding: utf-8 -*
import json
from utils.utils import datetime_to_string
from utils.connection import Connector

class sp_repository(object):
    def __init__(self):
        self.connector = Connector()
    
    def run_stored_procedure(self, likes, current_user_id):
        cnx = self.connector.open_connection()
        cursor = cnx.cursor()
        cursor.callproc('RECOMMEND_FOLLOW', [likes, current_user_id])
        ret = []
        for result in cursor.stored_results():
            ret.append(result.fetchall())
        cnx.commit()
        cursor.close()
        cnx.close()
        return ret