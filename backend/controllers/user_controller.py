import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.user_repository import UserRepository
from repository.post_repository import PostRepository
from repository.comment_repository import CommentRepository
from repository.follow_repository import FollowRepository

user_api = Blueprint('user_api', __name__)

sys.path.append('../')
config = Config()

@user_api.route('/api/user/<id>', methods=['GET'])
def get_profile_by_id(id):
    rep = UserRepository()
    ret = rep.get_profile_by_id(id)
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)

@user_api.route('/api/user/<id>/posts', methods=['GET'])
def get_profile_post_by_id(id):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = PostRepository()
    ret, total = rep.get_profile_post_by_id(id, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@user_api.route('/api/user/<id>/comments', methods=['GET'])
def get_profile_comment_by_id(id):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = CommentRepository()
    ret, total = rep.get_profile_comment_by_id(id, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@user_api.route('/api/user/<id>/profile', methods=['PUT'])
def set_profile_by_id(id):
    rep = UserRepository()
    rows_affected = rep.set_profile_by_id(id)
    r = {'code': 200, 'msg': ""}
    return jsonify(r)

@user_api.route('/api/user/<id>/following', methods=['GET'])
def get_profile_following_by_id(id):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = FollowRepository()
    ret, total = rep.get_profile_following_by_id(id, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@user_api.route('/api/user/<id>/follower', methods=['GET'])
def get_profile_follower_by_id(id):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = FollowRepository()
    ret, total = rep.get_profile_follower_by_id(id, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)

@user_api.route('/api/user/follow/<id1>/<id2>', methods=['POST'])
def set_profile_follow_by_id_route(id1, id2):
    rep = FollowRepository()
    rows_affected = rep.set_profile_follow_by_id(id1, id2)
    r = {'code': 200, 'msg': ""}
    return jsonify(r)

@user_api.route('/api/user/follow/<id1>/<id2>', methods=['DELETE'])
def delete_profile_follow_by_id(id1, id2):
    rep = FollowRepository()
    rows_affected = rep.delete_profile_follow_by_id(id1, id2)
    r = {'code': 200, 'msg': ""}
    return jsonify(r)

@user_api.route('/api/signup', methods=['POST'])
def signup():
    rep = UserRepository()
    ret = rep.signup()
    if len(ret) == 0:
        r = {'code': 403, 'msg': "User Exists"}
        return jsonify(r)
    else :
        r = {'code': 200, 'msg': "", 'data': ret}
        return jsonify(r)

@user_api.route('/api/login', methods=['PUT'])
def login():
    rep = UserRepository()
    ret = rep.login()
    if ret == 0:
        r = {'code': 401, 'msg': "Illegal User"}
        return jsonify(r)
    else:
        r = {'code': 200, 'msg': ""}
        return jsonify(r)