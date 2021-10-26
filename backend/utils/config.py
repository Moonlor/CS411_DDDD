# -*- coding: utf-8 -*


class Config(object):
    def __init__(self):
        self.ip = 'pc.washingpatrick.cn'
        self.bolt_endpoint = '7687'
        self.http_endpoint = '7474'
        self.username = 'neo4j'
        self.password = 'infowall'
        self.bolt_url = 'bolt://' + self.ip + ':' + self.bolt_endpoint
        self.http_url = 'http://' + self.ip + ':' + self.http_endpoint + '/db/data/transaction/commit'
        self.upload_folder = 'static/upload'

        self.mysql_conf = {
            "host": "35.238.20.175",
            "user":"root", 
            "password":"groupdddd",
            "db":"cs411",
        }
