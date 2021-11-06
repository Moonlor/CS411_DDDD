import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.restaurant_repository import RestaurantRepository

restaurant_api = Blueprint('restaurant_api', __name__)

sys.path.append('../')
config = Config()

@restaurant_api.route('/api/restaurant/<id>', methods=['GET'])
def get_by_id(id):
    rep = RestaurantRepository()
    ret = rep.get_restaurant_by_id(id)
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)

@restaurant_api.route('/api/restaurant/search/<keyword>', methods=['GET'])
def get_by_keyword(keyword):
    rep = RestaurantRepository()
    ret = rep.search_restaurant_by_keyword(keyword)
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)
    
