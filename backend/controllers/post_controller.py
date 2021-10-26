import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config

post_api = Blueprint('post_api', __name__)

sys.path.append('../')
config = Config()

@post_api.route('/api/post/<id>', methods=['GET'])
def get_by_id(id):
    
    r = {'get': id}
    return jsonify(r)
