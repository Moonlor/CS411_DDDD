import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.advance_repository import AdvanceRepository

advance_api = Blueprint('advance_api', __name__)

sys.path.append('../')
config = Config()

@advance_api.route('/api/advance/similar/<c1>/<c2>', methods=['GET'])
def get_similar_user(c1, c2):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = AdvanceRepository()
    ret, total = rep.get_similar_user_by_category(c1, c2, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@advance_api.route('/api/advance/likes/<likes>', methods=['GET'])
def get_popular_user(likes):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = AdvanceRepository()
    ret, total = rep.get_user_with_likes_more_than(likes, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)