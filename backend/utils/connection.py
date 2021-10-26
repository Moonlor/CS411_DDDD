import sqlite3
from google.cloud import storage 
import pandas as pd
import numpy as np
from datetime import datetime
import mysql.connector
import sys

cnx = mysql.connector.connect(user='root', password='groupdddd', host='35.238.20.175', 
                              database='cs411')

cursor = cnx.cursor()
query1 = ("select * from Comment")
cursor.execute(query1)

frame = pd.DataFrame(cursor.fetchall())

print(frame.head())

cursor.close()
cnx.close()