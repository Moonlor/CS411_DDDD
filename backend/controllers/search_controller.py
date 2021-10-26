from utils.repository import Repository
import sys
from py2neo import Graph, Node, Relationship
from flask import abort
from utils.config import Config
from utils.neo4j_graph import query
from flask import jsonify
from flask import request
from flask import Blueprint

search_api = Blueprint('search_api', __name__)

# sys.path.append('../')
# config = Config()
# graph = Graph(config.bolt_url, username=config.username, password=config.password)
# repository = Repository()


def get_count(keyword):
    q_str = '''
        CALL db.index.fulltext.queryNodes("titlesAndDescriptions", "{}") YIELD node, score
        RETURN COUNT(node)
        '''.format(keyword)

    return query([q_str])


def get_rcount(keyword):
    q_str = '''
        CALL db.index.fulltext.queryNodes("titlesAndDescriptions", "{}") YIELD node AS n1
        MATCH p=(n1)-[r:RELTYPE]-(n2) 
        RETURN COUNT(r)
        '''.format(keyword)

    return query([q_str])

@search_api.route('/api/query', methods=['POST'])
def query_api():
    q_str = '''
            MATCH p=()-->() RETURN p
            '''

    params = request.json
    if not params or 'query_list' not in params:
        query_list = [q_str]
        print('[!] Warning: no sql cmd specified')
        print(params)
    else:
        query_list = params['query_list']

    if type(query_list) is not list or len(query_list) == 0:
        query_list = [q_str]

    return jsonify(repository.replace_meta(query([q_str])))


@search_api.route('/api/search', methods=['POST'])
def search():
    page = int(request.args.get("page"))
    size = int(request.args.get("size"))

    params = request.json
    keyword = params['keyword']

    count = get_count(keyword)['results'][0]['data'][0]['row'][0]

    q_str = '''
            CALL db.index.fulltext.queryNodes("titlesAndDescriptions", "{}") YIELD node, score
            RETURN node, score ORDER BY node.importance DESC, node.is_hot DESC SKIP {} LIMIT {}
            '''.format(keyword, (page-1) * size, size)

    r = query([q_str])
    if len(r['errors']) == 0:
        r['count'] = count

    return jsonify(repository.replace_meta(r))


@search_api.route('/api/rsearch', methods=['POST'])
def rsearch():
    page = int(request.args.get("page"))
    size = int(request.args.get("size"))

    params = request.json
    keyword = params['keyword']

    count = get_rcount(keyword)['results'][0]['data'][0]['row'][0]

    q_str = '''
            CALL db.index.fulltext.queryNodes("titlesAndDescriptions", "{}") YIELD node AS n1
            MATCH p=(n1)-[r:RELTYPE]-(n2) 
            RETURN r, n1, n2, COUNT(r) ORDER BY n1.importance DESC, n2.importance DESC, n1.is_hot DESC, n2.is_hot DESC SKIP {} LIMIT {}
            '''.format(keyword, (page-1) * size, size)
    r = query([q_str])
    if len(r['errors']) == 0:
        r['results'][0]['data'] = repository.rel_nodes(r)
        r['count'] = count
    return jsonify(r)
