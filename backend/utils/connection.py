import sqlite3
# from google.cloud import storage
import pandas as pd
import numpy as np
from datetime import datetime
import mysql.connector
import sys

class Connector:
    def __init__(self):
        self.cnx = None

    def open_connection(self):
        if not self.cnx:
            self.cnx = mysql.connector.connect(user='root', password='groupdddd', host='35.238.20.175', 
                                    database='cs411')
        return self.cnx
    
    def close_connection(self):
        if self.cnx:
            self.cnx.close()
            self.cnx = None