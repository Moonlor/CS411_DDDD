import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config

user_api = Blueprint('user_api', __name__)

sys.path.append('../')
config = Config()

@user_api.route('/api/user/<id>', methods=['GET'])
def get_by_id(id):
    
    r = {'get': id}
    return jsonify(r)
