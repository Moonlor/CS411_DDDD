import sys
from py2neo import Graph, Node, Relationship
from flask import abort
from utils.config import Config
from utils.neo4j_graph import query
from utils.repository import Repository
from flask import jsonify
from flask import request
from flask import Blueprint

rel_api = Blueprint('rel_api', __name__)

# sys.path.append('../')
# config = Config()
# repository = Repository()
# graph = Graph(config.bolt_url, username=config.username,
#               password=config.password)


def get_count():
    q_str = '''
        MATCH p=(n1)-[r:RELTYPE]->(n2) RETURN COUNT(r)
        '''

    return query([q_str])

@rel_api.route('/api/rels', methods=['GET'])
def rels_get():
    page = int(request.args.get("page"))
    size= int(request.args.get("size"))
    q_str = '''
        MATCH p=(n1)-[r:RELTYPE]->(n2) RETURN r, n1, n2, count(r)
        '''
    if page and size:
        q_str = '''
        MATCH p=(n1)-[r:RELTYPE]->(n2) RETURN r, n1, n2, count(r) ORDER BY n1.importance DESC, n2.importance DESC, n1.is_hot DESC, n2.is_hot DESC SKIP {} LIMIT {}
        '''.format((page-1) * size, size)
    r = query([q_str])
    count = get_count()['results'][0]['data'][0]['row'][0]
    if len(r['errors']) == 0:
        r['results'][0]['data'] = repository.rel_nodes(r)
        r['count'] = count
    return jsonify(r)


@rel_api.route('/api/rel/<source>/<target>', methods=['GET'])
def rel_get(source, target):
    q_str = '''
        MATCH p=(n1:InfoNode)-[r:RELTYPE]->(n2:InfoNode)
        WHERE n1.id = {} AND n2.id = {} return r
        '''.format(source, target)
    return jsonify(query([q_str]))


@rel_api.route('/api/rel', methods=['POST'])
def rel_post():
    params = request.json
    q_str = '''
        MATCH (from:InfoNode) where from.id = toInteger({})
        MATCH (to:InfoNode) where to.id = toInteger({})
        CREATE (from)-[r:RELTYPE {{ rel: "{}"}}]->(to);
        '''.format(params.get('source'), params.get('target'), params.get('relation'))
    print(q_str)
    return jsonify(query([q_str]))


@rel_api.route('/api/rel', methods=['DELETE'])
def rel_delete():
    params = request.json
    q_str = '''
        MATCH p=(n1:InfoNode)-[r:RELTYPE]->(n2:InfoNode)
        WHERE n1.id = {} AND n2.id = {}
        DELETE r
        '''.format(params.get('source'), params.get('target'))
    return jsonify(query([q_str]))
