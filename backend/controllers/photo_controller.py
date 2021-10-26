import sys
import os
from werkzeug.utils import secure_filename
from py2neo import Graph, Node, Relationship
from flask import abort, make_response
from utils.config import Config
from utils.neo4j_graph import query
from utils.repository import Repository
from flask import jsonify
from flask import request
from flask import Blueprint
import datetime
import random

photo_api = Blueprint('photo_api', __name__)

# sys.path.append('../')
# config = Config()
# repository = Repository()
# graph = Graph(config.bolt_url, username=config.username,
#               password=config.password)

basedir = os.path.abspath(os.path.dirname(__file__)) + "/../"
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'gif', 'GIF'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def create_uuid():  # 生成唯一的图片的名称字符串，防止图片显示时的重名问题
    nowTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # 生成当前时间
    randomNum = random.randint(0, 100)  # 生成的随机整数n，其中0<=n<=100
    if randomNum <= 10:
        randomNum = str(0) + str(randomNum)
    uniqueNum = str(nowTime) + str(randomNum)

    return uniqueNum


@photo_api.route('/api/photo/upload', methods=['POST'], strict_slashes=False)
def photo_upload():
    file_dir = os.path.join(basedir, config.upload_folder)
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)
    f = request.files['photo']
    if f and allowed_file(f.filename):
        fname = secure_filename(f.filename)
        ext = fname.rsplit('.', 1)[1]
        new_filename = create_uuid() + '.' + ext
        f.save(os.path.join(file_dir, new_filename))

        return jsonify({"errors": [], "results": new_filename})
    else:
        return jsonify({"errors": ['Upload failed'], "results": []})


@photo_api.route('/api/photo/<filename>', methods=['GET'])
def show_photo(filename):
    file_dir = os.path.join(basedir, config.upload_folder)
    if filename is None:
        pass
    else:
        image_data = open(os.path.join(file_dir, '%s' % filename), "rb").read()
        response = make_response(image_data)
        response.headers['Content-Type'] = 'image/png'
        return response
