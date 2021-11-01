import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.comment_repository import CommentRepository

post_comment_api = Blueprint('comment_api', __name__)

sys.path.append('../')
config = Config()

@post_comment_api.route('/api/post_comment/<id>', methods=['GET'])
def get_by_id(id):
    rep = CommentRepository()
    ret = rep.get_comment_by_post_comment_id(id)
    r = {'get': ret}
    return jsonify(r)

@post_comment_api.route('/api/post_comment/<id>', methods=['DELETE'])
def delete_by_id(id):
    rep = CommentRepository()
    rows_affected = rep.delete_post_comment_by_post_comment_id(id)
    r = {'rows_affected': rows_affected}
    return jsonify(r)


@post_comment_api.route('/api/post_comment', methods=['POST'])
def create_post_comment():
    rep = CommentRepository()
    rows_affected = rep.create_post_comment(request)
    r = {'rows_affected': rows_affected}
    return jsonify(r)
