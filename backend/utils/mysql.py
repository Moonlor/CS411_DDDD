from utils.config import Config
import pymysql


config = Config()

@Singleton
class MysqlConn:

    def __init__(self):
        this.conn = pymysql.connect(
            host=config.mysql_conf["host"],
            user=config.mysql_conf["user"],
            password = config.mysql_conf["password"],
            db=config.mysql_conf["db"])

def getConn():
    return MysqlConn.instance()