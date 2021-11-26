import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.sp_repository import sp_repository

sp_api = Blueprint('sp_api', __name__)

sys.path.append('../')
config = Config()

@sp_api.route('/api/store_procedure/<likes>', methods=['POST'])
def run_procedure(likes):
    user_id = request.args.get("user_id")
    rep = sp_repository()
    ret = rep.run_stored_procedure(likes, user_id)
    r = {'code': 200, 'msg': "", 'data': ret}
    return jsonify(r)