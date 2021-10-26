import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config

restaurant_api = Blueprint('restaurant_api', __name__)

sys.path.append('../')
config = Config()

@restaurant_api.route('/api/restaurant/<id>', methods=['GET'])
def get_by_id(id):
    
    r = {'get': id}
    return jsonify(r)
