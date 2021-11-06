import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.post_repository import PostRepository

post_api = Blueprint('post_api', __name__)

sys.path.append('../')
config = Config()

@post_api.route('/api/post/<id>', methods=['GET'])
def get_by_id(id):
    rep = PostRepository()
    ret = rep.get_post_by_id(id)
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)

@post_api.route('/api/post/<id>', methods=['DELETE'])
def delete_by_id(id):
    rep = PostRepository()
    rows_affected = rep.delete_post_by_id(id)
    r = {'code': 200, 'msg': ""}
    return jsonify(r)

@post_api.route('/api/posts', methods=['GET'])
def get_all_posts():
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = PostRepository()
    ret, total = rep.get_all_posts(offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@post_api.route('/api/post/restaurant/<id>', methods=['GET'])
def get_post_by_restaurant_id(id):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = PostRepository()
    ret, total = rep.get_posts_by_restaurant_id(id, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@post_api.route('/api/post', methods=['POST'])
def create_post():
    rep = PostRepository()
    ret = rep.create_post()
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)

@post_api.route('/api/post', methods=['PUT'])
def update_post():
    rep = PostRepository()
    ret = rep.update_post()
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)