import sys
from flask import abort
from flask import jsonify
from flask import request
from flask import Blueprint
from utils.config import Config
from repository.checkin_repository import CheckinRepository

checkin_api = Blueprint('checkin_api', __name__)

sys.path.append('../')
config = Config()

@checkin_api.route('/api/checkin/<id>', methods=['GET'])
def get_checkin_by_id(id):
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    rep = CheckinRepository()
    ret, total = rep.get_checkin_by_userid(id, offset, limit)
    r = {'code': 200, 'msg': "", 'data': ret, 'pageNumber': offset, 'pageSize': limit, 'total': total}
    return jsonify(r)