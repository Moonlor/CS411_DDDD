import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config

comment_api = Blueprint('comment_api', __name__)

sys.path.append('../')
config = Config()

@comment_api.route('/api/post_comment/<id>', methods=['GET'])
def get_by_id(id):
    
    r = {'get': id}
    return jsonify(r)
