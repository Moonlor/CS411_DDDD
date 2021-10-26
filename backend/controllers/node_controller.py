import sys
from py2neo import Graph, Node, Relationship
from flask import abort
from utils.config import Config
from utils.neo4j_graph import query
from flask import jsonify
from flask import request
from flask import Blueprint
import datetime
import random
from utils.repository import Repository

node_api = Blueprint('node_api', __name__)

# sys.path.append('../')
# config = Config()
# graph = Graph(config.bolt_url, username=config.username, password=config.password)
# repository = Repository()


def create_uuid():  # 生成唯一的图片的名称字符串，防止图片显示时的重名问题
    nowTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # 生成当前时间
    randomNum = random.randint(0, 100)  # 生成的随机整数n，其中0<=n<=100
    if randomNum <= 10:
        randomNum = str(0) + str(randomNum)
    uniqueNum = str(nowTime) + str(randomNum)

    return uniqueNum

def get_count():
    q_str = '''
        MATCH (n:InfoNode) RETURN COUNT(n)
        '''
    
    return query([q_str])

@node_api.route('/api/nodes', methods=['GET'])
def nodes_get():
    q_str = '''
        MATCH (n:InfoNode) RETURN n
        '''
    page = int(request.args.get("page"))
    size = int(request.args.get("size"))
    count = get_count()['results'][0]['data'][0]['row'][0]
    if page and size:
        q_str = '''
        MATCH (n:InfoNode) RETURN n ORDER BY n.importance DESC, n.is_hot DESC SKIP {} LIMIT {}
        '''.format((page-1) * size, size)
    r = query([q_str])
    if len(r['errors']) == 0:
        r['count'] = count

    return jsonify(repository.replace_meta(r))


@node_api.route('/api/node/<id>', methods=['GET'])
def node_get(id):
    params = request.json
    id = int(id)
    q_str = '''
        MATCH (n:InfoNode) WHERE n.id = toInteger({})
        RETURN n
        '''.format(id)
    return jsonify(repository.replace_meta(query([q_str])))

@node_api.route('/api/node', methods=['POST'])
def node_post():
    params = request.json
    q_str = '''
        CREATE (n:InfoNode 
        {{id: toInteger({}), name:"{}", ext:"{}", importance:"{}", is_hot:"{}", is_favorite:"{}", 
        info_type:"{}", node_type:"{}", node_color:"{}", level:"{}", time:"{}"}}) RETURN n
        '''.format(create_uuid(), params.get('name'), params.get('ext'), params.get('importance'), params.get('is_hot'), params.get('is_favorite'), 
                   params.get('info_type'), params.get('node_type'), params.get('node_color'), params.get('level'), params.get('time')
                   )
    return jsonify(repository.replace_meta(query([q_str])))


@node_api.route('/api/node', methods=['PUT'])
def node_put():
    params = request.json
    id = params.get('id')
    if not params.get('name'):
        q_str = '''
        MATCH (n:InfoNode) WHERE n.id = toInteger({})
        SET n.is_favorite="{}"
        RETURN n
        '''.format(id, params.get('is_favorite'))
    else:
        q_str = '''
        MATCH (n:InfoNode) WHERE n.id = {}
        SET n = {{id: toInteger({}), name:"{}", ext:"{}", importance:"{}", is_hot:"{}", is_favorite:"{}",
        info_type:"{}", node_type:"{}", node_color:"{}", level:"{}", time:"{}" }}
        RETURN n
        '''.format(id, id, params.get('name'), params.get('ext'), params.get('importance'), params.get('is_hot'), params.get('is_favorite'),
                   params.get('info_type'), params.get('node_type'), params.get('node_color'), params.get('level'), params.get('time')
                   )
    return jsonify(repository.replace_meta(query([q_str])))


@node_api.route('/api/node', methods=['DELETE'])
def node_delete():
    params = request.json
    id = params.get('id')
    q_str = '''
        MATCH (n:InfoNode) WHERE n.id = toInteger({})
        DETACH DELETE n
        '''.format(params.get('id'))
    return jsonify(repository.replace_meta(query([q_str])))

